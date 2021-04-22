import { CommentSemiColon, startingMultiLineComment, endingMultiLineComment, whiteSpaceObj, variableCharsObj, operatorsObj, typeOfValidVarName, whiteSpaceOverrideAssign } from './tokens'
// import {whiteSpaaaaaceObj} from './usage'
const d = console.debug.bind(console)
// d(whiteSpaaaaaceObj)

export default (content: string) => {
  // const trie = {}
  // const addToTrie = createAddToTrie(trie)
  // addToTrie('#NoEnv', () => console.log(23423))
  // addToTrie(':=', () => console.log('fwefwe\'f'))

  // https://stackoverflow.com/questions/6784799/what-is-this-char-65279#answer-6784805
  // https://stackoverflow.com/questions/13024978/removing-bom-characters-from-ajax-posted-string#answer-13027802
  if (content[0] === '\ufeff') {
    content = content.slice(1)
  }
  const lines = content.split('\n')
  const howManyLines = lines.length
  const everything = []
  const toFile = ''

  let i = 0, c = 0, numberOfChars = 0, validName = '', strStartLine: number, strStartPos: number, insideContinuation = false, beforeConcat: number, nonWhiteSpaceStart: number, exprFoundLine = -1,colonDeep = 0

  lineLoop:
  while (i < howManyLines) {
    c = 0
    numberOfChars = lines[i].length

    skipThroughWhiteSpaces()

    //#multiline comments
    //if line starts with /*
    // leave 2 chars at end
    const numCharsMinusOne = numberOfChars - 1
    if (c < numCharsMinusOne && lines[i].slice(c, c + 2) === '/*') {
      const multiLineCommentLineStart = i, multiLineCommentColStart = c
      // d('MultilineComment START', l())
      while (++i < howManyLines) {
        c = 0
        const numCharsMinusOne = lines[i].length - 1

        //skip through whiteSpaces
        while (c < numCharsMinusOne && whiteSpaceObj[lines[i][c]]) {
          c++
        }

        //if line starts with */
        if (lines[i].slice(c, c + 2) === '*/') {
          everything.push({ type: 'MultilineComment', lineStart: multiLineCommentLineStart, colStart: multiLineCommentColStart, lineEnd: i, colEnd: c + 2 })
          // d('MultilineComment END', l())
          i++
          continue lineLoop
        }
      }
    }
    //out of lines
    if (i === howManyLines) {
      break lineLoop
    }
    //nothing left, continue
    if (c === numberOfChars) {
      i++
      continue lineLoop
    }

    //#semicolon comments
    if (lines[i][c] === ';') {
      // d('SemiColonComment', `${c}-END`, l())
      // everything.push({type: 'SemiColonComment', line: i, colStart: c})
      i++
      continue lineLoop
    }

    nonWhiteSpaceStart = c
    //stumble upon a valid variable Char
    if (variableCharsObj[lines[i][c]]) {
      c++

      skipValidChar()

      // if EOL, it must be COMMAND
      if (c === numberOfChars) {

        // d('COMMAND EOL', char())
        i++
        continue lineLoop
      }

      validName = lines[i].slice(nonWhiteSpaceStart, c)
      const idkType = typeOfValidVarName[validName.toLowerCase()]
      // comma can't be assignment, so I can skip assignment
      // if it has a comma, it could be a hotkey, it's only NOT a hotkey if it's a valid COMMAND
      if (lines[i][c] === ',') {
        // directive or command
        if (idkType === 1 || idkType === 4) {
          d(validName, 'DIRECTIVE OR COMMAND comma', char())
          i++
          continue lineLoop
        }
      }

      // only directives and "if" override assignment and ONLY when there's a whiteSpace
      if (whiteSpaceObj[lines[i][c]]) {
        if (whiteSpaceOverrideAssign[idkType]) {
          if (idkType === 1) {
            d(validName, 'whiteSpace DIRECTIVE', char())
          } else if (idkType === 2) {
            d(validName, 'if statement', char())
          } else if (idkType === 3) {
            d(validName, 'global local or static', char())
          }
          i++
          continue lineLoop
        }

        if (!skipThroughEmptyLines()) {
          //out of lines
          continue lineLoop
        }

        if (findOperators()) {
          d(`${validName} assignment whiteSpace`)
          findExpression()
          i++
          continue lineLoop
        }

        if (idkType === 4) {
          d(validName, 'whiteSpace COMMAND', char())
          i++
          continue lineLoop
        }

      } else {
        //labels can't have spaces
        // well, it's now or never to be a label: because label can't have %
        //#LABELS
        if (lines[i][c] === ':') {
          c++

          skipThroughWhiteSpaces()

          if (c === numberOfChars) {
            // d('LABEL EOL', char())
            i++
            continue lineLoop
          }

          if (lines[i][c] === ';') {
            // d('LABEL SemiColonComment', char())
            // everything.push({type: 'SemiColonComment', line: i, colStart: c})
            i++
            continue lineLoop
          }

          // if 2 consecutive ':' then hotkey
          if (lines[i][c] === ':') {
            // d('HOTKEY validVarName', char())
            i++
            continue lineLoop
          }

          c--

        }
      }

    }

    //%which_something%_var:=2 is valid
    //skip through % OR valid variable Chars
    while (c < numberOfChars && findPercentVar() || variableCharsObj[lines[i][c]]) {
      c++
    }
    if (c === numberOfChars) {
      d('unexpected EOL after var parsing')
      continue lineLoop
    }
    validName = lines[i].slice(nonWhiteSpaceStart, c)

    if (validName) {
      //#FUNCTION
      if (lines[i][c] === '(') {
        const validName = lines[i].slice(nonWhiteSpaceStart, c)
        // d('is not a number, valid func name')
        if (isNaN(Number(validName))) {
          if (isFunctionDefinition()) {
            d(validName,'Function DEFINITION', char())
            c++
            ch()
            return true
          } else {
            //#FUNCTION CALL
            d(`${validName} Function startOfLine${char()}`)
            c++
            findExpression()
            d(')END Function startOfLine', char())
            i++
            continue lineLoop
          }
          // everything.push({type: 'function', line: i, colStart:nonWhiteSpaceStart, colEnd:c, name:lines[i].slice(nonWhiteSpaceStart,c)})
        }

        //#METHOD OR PROPERTY
        // this is NOT a METHOD call:
        // str.=v[key] "+" k "|"
        // so check if the next character is a valid Var
      } else if (lines[i][c] === '.' && variableCharsObj[lines[i][c + 1]]) {
        const validName = lines[i].slice(nonWhiteSpaceStart, c)
        if (isNaN(Number(validName))) {
          // d('METHOD OR PROPERTY', char())
        }
      }

      if (!skipThroughEmptyLines()) {
        //out of lines
        continue lineLoop
      }

      if (findOperators()) {
        d(`${validName} assignment`)
        findExpression()
      }
    }

    //#HOTKEYS
    //skip first character to avoid matching ::, empty hotkey, or not matching :::, colon hotkey, because it matched only the first 2
    //skip ONLY if c is nonWhiteSpaceStart, which is first char
    c = (c === nonWhiteSpaceStart) ? c + 1 : c
    //advance until ':'
    while (c < numberOfChars) {
      if (lines[i][c] === ':') {
        c++
        if (c < numberOfChars && lines[i][c] === ':') {
          d(lines[i].slice(nonWhiteSpaceStart, c + 1), 'HOTKEY', char())
          // d('HOTKEY')
        }
      }
      c++
    }

    i++

  }
  // d(everything)
  // toFile = toFile.slice(1)
  // writeSync(toFile)
  return everything

  function isFunctionDefinition() {
    const iBak = i, cBak = c
    if (skipThroughFindChar(')')) {
      c++
      if (skipThroughEmptyLines()) {
        if (lines[i][c] === '{') {
          i = iBak,c = cBak
          return true
        }
      }
    } else {
      d('( with no closing ) isFunctionDefinition',char())
    }
    i = iBak,c = cBak
    return false
  }
  function findOperators() {
    //#VARIABLE ASSIGNMENT
    if (c < numberOfChars - 2 && operatorsObj[lines[i].slice(c, c + 3).toLowerCase()]) {
      d(lines[i].slice(c, c + 3), '3operator', char())
      c += 3
      return true
    } else if (c < numberOfChars - 1 && operatorsObj[lines[i].slice(c, c + 2).toLowerCase()]) {
      d(lines[i].slice(c, c + 2), '2operator', char())
      c += 2
      return true
    } else if (c < numberOfChars && operatorsObj[lines[i][c].toLowerCase()]) {
      if (lines[i][c] === '?') {
        d('? ternary',char())
        colonDeep++, c++
        findExpression()
        if (lines[i][c] === ':') {
          d(': ternary',char())
          colonDeep--,c++
          return true
        } else {
          d('why is there no : after ? ternary',char())
          colonDeep--,c++
          return false
        }
      } else if (lines[i][c] === ':') {
        if (!colonDeep) {
          d('unexpected :',char())
        }
        return false
      }
      d(lines[i][c], '1operator', char())
      c++
      return true
    } else {
      return false
    }

  }

  function betweenExpression() {
    exprFoundLine = i
    beforeConcat = c
    // d('OOOOO',lines[i][c])
    if (insideContinuation) {
      skipThroughWhiteSpaces()
      if (c !== numberOfChars && lines[i][c] === ';') {
        d('ILLEGAL semiColonComment insideContinuation', char())
        if (endExprContinuation()) {
          return findExpression()
        }
      }
    } else {
      skipThroughEmptyLines()
    }

    if (!findBetween()) {
      if (insideContinuation) {
        if (endExprContinuation()) {
          return findExpression()
        }
      }
    }

  }
  function findBetween() {
    const beforeConcatBak = beforeConcat, afterConcat = c, concatLineBak = i
    if (c === numberOfChars) {
      return false
    } else if (findOperators()) {
      return findExpression()
    } else if (whiteSpaceObj[lines[i][c - 1]] && findExpression()) {
      const concatWhiteSpaces = lines[i].slice(beforeConcatBak, afterConcat)
      d(`concat "${concatWhiteSpaces}" ${concatWhiteSpaces.length}LENGHT ${beforeConcatBak + 1} line ${concatLineBak + 1}`)
      return true
    } else {
      if (insideContinuation) {
        if (endExprContinuation()) {
          findExpression()
          return true
        }
      } else {
        return false
      }
    }
  }
  function findExpression() {
    skipThroughWhiteSpaces()
    //nothing left, continue
    if (c === numberOfChars || lines[i][c] === ';') {
      if (insideContinuation) {
        if (endExprContinuation()) {
          findExpression()
        }
      } else {
        if (startContinuation()) {
          i++, c = 0, numberOfChars = lines[i].length
          findExpression()
        }
      }
      return false
    }
    const nonWhiteSpaceStart = c
    //stumble upon a valid variable Char
    if (lines[i][c] === '%' || variableCharsObj[lines[i][c]]) {
      c++

      skipValidChar()

      validName = lines[i].slice(nonWhiteSpaceStart, c)
      if (c === numberOfChars) {
        if (isNaN(Number(validName))) {
          d(`${validName} validName VARIABLE EOL ${char()}`)
        } else {
          d(`${validName} Integer EOL ${char()}`)
        }
        betweenExpression()
        return true
      }

      //skip through % OR valid variable Chars
      while (c < numberOfChars && lines[i][c] === '%' || variableCharsObj[lines[i][c]]) {
        c++
      }
      validName = lines[i].slice(nonWhiteSpaceStart, c)
      if (c === numberOfChars) {
        d(`${validName} %VARIABLE% EOL ${char()}`)
        betweenExpression()
        return true
      }

      if (findMethodOrDecimal()) {
        return true
      }

      //#FUNCTION CALL
      if (lines[i][c] === '(') {
        d(`${validName} Function ${char()}`)
        c++
        findExpression()
        d(')END Function', char())
        c++
        return true
      } else if (lines[i][c] === '[') {
        d(`${validName} Array/Map Access ${char()}`)
        return true
      } else {
        if (isNaN(Number(validName))) {
          d(`${validName} idkVariable ${char()}`)
        } else {
          d(`${validName} Integer ${char()}`)
        }
        betweenExpression()
        return true
      }

    }

    if (findDoubleQuotedString()) {
      // d(lines[i][c])
      betweenExpression()
      return true
    }

    if (lines[i][c] === '(') {
      d('( start', char())
      c++
      findExpression()
      d(') end', char())
      c++
      return true
    }

    if (lines[i][c] === '[') {
      d('[ start', char())
      c++

      // let arrOnWhichLine: number
      while (true) {
        if (!findExpression()) {
          if (lines[i][c] === ',') {
            d('ILLEGAL trailling ,', char())
          } else if (lines[i][c] === ']') {
            d('v`alid empty arr', char())
          } else {
            d('illegal arr1', char())
          }
          break
        }
        if (lines[i][c] !== ',') {
          break
        }
        c++
      }
      if (i !== exprFoundLine) {
        d('ILLEGAL ]', char())
      }
      d('] end', char())
      c++
      return true
    }

    if (lines[i][c] === '{') {
      d('{ start', char())
      colonDeep++, c++

      while (true) {
        if (!findExpression()) {
          if (lines[i][c] === ',') {
            d('ILLEGAL trailling ,', char())
          } else if (lines[i][c] === '}') {
            d('valid empty obj', char())
          } else {
            d('illegal obj1', char())
          }
          break
        }

        if (lines[i][c] === ':') {
          d(': object',char())
        } else {
          d('illegal obj2', char())
        }
        c++ //skip :
        findExpression()
        if (lines[i][c] !== ',') {
          break
        }
        c++
      }
      if (i !== exprFoundLine) {
        d('ILLEGAL }', char())
      }
      d('} end', char())
      colonDeep--, c++
      return true
    }

  }
  function findMethodOrDecimal() {
    if (lines[i][c] === '.' && variableCharsObj[lines[i][c + 1]]) {
      if (isNaN(Number(validName))) {
        d(validName, 'METHOD OR PROPERTY', char())
        return true
      } else {
        d(validName, 'DECIMAL NUMBER', char())
        return true
      }
    }
    return false
  }
  function findDoubleQuotedString() {
    if (lines[i][c] === '"') {
      strStartPos = c, strStartLine = i
      c++
      if (findEndOfStringInLine()) {
        return true
      } else {
        if (insideContinuation) {
          endStringContinuation()
        } else {
          if (startContinuation()) {
            d('stringContinuation START', char())
            endStringContinuation()
            return true
          }
        }
        return true
      }


    } else {
      return false
    }

  }
  function findEndOfStringInLine() {
    while (true) {
      //maybe end of string
      if (c === numberOfChars) {
        // stringContinuation()
        return false
        c++
      } else if (lines[i][c] === '"') {
        // "" is escapechar
        // d(lines[i][c + 1])
        if (c < numberOfChars - 1 && lines[i][c + 1] === '"') {
          c += 2
          continue
        } else {
          //end of string
          //to slice, the caret must be outside, or to the right of c
          c++
          d(printString(), 'String')
          // d('end', lines[i].slice(strStartPos,c + 1))
          return true
        }
        // comment and expectMultiline
      } else if (lines[i][c] === ';' && whiteSpaceObj[lines[i][c - 1]]) {
        d('comment when string', char())
        // d('comment and expectMultiline')
        return false
        // c++
        // return true
      } else {
        c++
      }
    }
  }
  function startContinuation() {
    i++
    while (i < howManyLines) {
      c = 0
      numberOfChars = lines[i].length
      skipThroughWhiteSpaces()
      if (c === numberOfChars) {
        d('Continuation skip empty line')
        i++
        continue
      } else if (lines[i][c] === ';') {
        d('Continuation comment...')
        i++
        continue
      } else if (lines[i][c] === '(') {
        insideContinuation = true
        return true
      } else {
        d(`illegal ${lines[i][c]} c:${c} numberOfChars:${numberOfChars}`)
        //illegal
        return false
      }
    }
    // how to return out of lines ???
    return -1
  }
  function endExprContinuation() {
    i++, c = 0, numberOfChars = lines[i].length
    skipThroughWhiteSpaces()
    if (c !== numberOfChars && lines[i][c] === ')') {
      insideContinuation = false
      d(`) Expression ${char()}`)
      c++
      return true
    } else {
      d(`illegal in endExprContinuation ${char()}`)
      return false
    }
  }
  function endStringContinuation() {
    //now continue until I find a line starting with ')'
    i++
    while (i < howManyLines) {
      c = 0, numberOfChars = lines[i].length
      skipThroughWhiteSpaces()
      if (c < numberOfChars && lines[i][c] === ')') {
        insideContinuation = false
        d('stringContinuation END', char())
        c++
        return findEndOfStringInLine()
      } else if (findEndOfStringInLine()) {
        betweenExpression()
        return
        // return true
      } else {
        i++
        continue
      }
    }
  }
  function skipThroughFindChar(charToFind) {
    //also skip through whiteSpaces, comments
    outer:
    while (true) {
      skipThroughWhiteSpaces()
      //EOL: next line
      while (c < numberOfChars) {
        if (lines[i][c] === ';' && whiteSpaceObj[lines[i][c - 1]]) {
          d('comment while skipThroughFindChar', char())
        } else if (lines[i][c] === charToFind) {
          return true
        }
        c++
      }
      i++
      if (i < howManyLines) {
        c = 0, numberOfChars = lines[i].length
        continue outer
      } else {
        break outer
      }
    }
    return false
  }
  function skipThroughEmptyLines() {
    //also skip through whiteSpaces, comments
    while (true) {
      skipThroughWhiteSpaces()
      //EOL: next line
      if (c === numberOfChars) {
        //comment: next line
      } else if (lines[i][c] === ';' && whiteSpaceObj[lines[i][c - 1]]) {
        d('comment while skipThroughEmptyLines', char())
      } else {
        //anything else, return found
        return true
      }
      i++
      if (i < howManyLines) {
        c = 0, numberOfChars = lines[i].length
      } else {
        break
      }
    }
    return false
  }
  function skipThroughWhiteSpaces() {
    while (c < numberOfChars && whiteSpaceObj[lines[i][c]]) {
      c++
    }
  }
  function findObjKey() {
    skipThroughWhiteSpaces()
    if (variableCharsObj[lines[i][c]]) {
      nonWhiteSpaceStart = c
      c++
      while (variableCharsObj[lines[i][c]]) {
        c++
      }
      d(lines[i].slice(nonWhiteSpaceStart, c), 'validName findObjKey', char())
      return true
    } else if (lines[i][c] === '(') {
      d('( obj dyn key', char())
      c++
      findExpression()
      d(') obj dyn key', char())
      c++
      return true
    } else if (findDoubleQuotedString()) {
      return true
    } else {
      return false
    }
  }
  function findPercentVar() {
    const percentVarStart = c
    if (c < numberOfChars && lines[i][c] === '%') {
      c++
      skipValidChar()
      d(lines[i][c])
      if (c < numberOfChars && lines[i][c] === '%') {
        d(`${lines[i].slice(percentVarStart, c)} %VAR% ${char()}`)
        return true
      } else {
        d(lines[i].slice(nonWhiteSpaceStart, c), 'ILLEGAL %VAR%', char())
        return false
      }
    } else {
      return false
    }
  }
  function skipValidChar() {
    //skip through valid variable Chars
    while (c < numberOfChars && variableCharsObj[lines[i][c]]) {
      c++
    }
  }
  function writeSync(content: string) {
    const fs = require('fs')
    fs.writeFileSync('outputToFile.txt', content, 'utf-8')
    // console.log('readFileSync complete')
  }
  function printString() {
    if (strStartLine === i) {
      return lines[i].slice(strStartPos, c)
    } else {
      let strToPrint = lines[strStartLine].slice(strStartPos)
      for (let i2 = strStartLine + 1; i2 < i; i2++) {
        // console.log(lines[i2])
        strToPrint += `\n${lines[i2]}`
      }
      strToPrint += `\n${lines[i].slice(0, c)}`
      return strToPrint
    }
    // d('no quote after DoubleQuotesString', `Ln ${strStartLine + 1}, Col ${strStartPos + 1} - Ln ${i + 1}, Col ${c + 1}`)

  }
  function ch() {
    d(lines[i][c])
  }
  function char() {
    return `${c + 1} ${l()}`
  }
  function l() {
    return `line ${i + 1}`
  }
  // function createAddToTrie(trie) {
  // let c: number, strLenMinusOne
  // return function addToTrie(string1, func) {
  // c = 0, strLenMinusOne = string1.length - 1
  // recursiveAddKey(trie)
  // function recursiveAddKey(obj) {
  // const letter = string1[c]
  // if (c < strLenMinusOne) {
  // obj[letter] = obj[letter] || {}
  // c++
  // recursiveAddKey(obj[letter])
  // } else {
  // obj[letter] = func
  // }
  // }
  // }
  // }
}

