delimArrArr.push({startDelims:startDelims, endDelims:endDelims, ignoreTimes:ignoreTimes})
; lookingForArr:=[{level: delimArrArr.Length + 1, endDelim:getUntil}] ;{level, endDelim} ;to save the higher level delim if start a new Delim
; lookingForArr.InsertAt(1, {level:indexArr, endDelim: delimArr.endDelims[index]})