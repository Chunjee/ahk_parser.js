
type stringIndexBool = {
  [key: string]: boolean,
}
type stringIndexNum = { [key: string]: number }

export const whiteSpace = /\u000B\u000C\u0020\u00A0/
export const whiteSpaceObj: stringIndexBool = {' ':true,'\t':true}
// "([a-zA-Z0-9_#@$]+)\(.*?\)"
export const variableCharsObj: stringIndexBool = {'a':true,'b':true,'c':true,'d':true,'e':true,'f':true,'g':true,'h':true,'i':true,'j':true,'k':true,'l':true,'m':true,'n':true,'o':true,'p':true,'q':true,'r':true,'s':true,'t':true,'u':true,'v':true,'w':true,'x':true,'y':true,'z':true,'A':true,'B':true,'C':true,'D':true,'E':true,'F':true,'G':true,'H':true,'I':true,'J':true,'K':true,'L':true,'M':true,'N':true,'O':true,'P':true,'Q':true,'R':true,'S':true,'T':true,'U':true,'V':true,'W':true,'X':true,'Y':true,'Z':true,'0':true,'1':true,'2':true,'3':true,'4':true,'5':true,'6':true,'7':true,'8':true,'9':true,'_':true,'#':true,'@':true,'$':true}

// export const whiteSpaceObj: stringIndexBool = {' ':true,'	':true}
// export const whiteSpaceObj = {'\u000B':true,'\u000C':true,'\u0020':true,'\u00A0':true}
export const CommentSemiColon = /^[\u000B\u000C\u0020\u00A0]*;/
export const startingMultiLineComment = /^[\u000B\u000C\u0020\u00A0]*\/\*/
export const endingMultiLineComment = /^[\u000B\u000C\u0020\u00A0]*\*\//

export const typeOfValidVarName: stringIndexNum = {'autotrim':4,'blockinput':4,'break':4,'catch':4,'click':4,'clipwait':4,'continue':4,'control':4,'controlclick':4,'controlfocus':4,'controlget':4,'controlgetfocus':4,'controlgetpos':4,'controlgettext':4,'controlmove':4,'controlsend':4,'controlsendraw':4,'controlsettext':4,'coordmode':4,'critical':4,'detecthiddentext':4,'detecthiddenwindows':4,'drive':4,'driveget':4,'drivespacefree':4,'edit':4,'else':4,'envadd':4,'envdiv':4,'envget':4,'envmult':4,'envset':4,'envsub':4,'envupdate':4,'exit':4,'exitapp':4,'fileappend':4,'filecopy':4,'filecopydir':4,'filecreatedir':4,'filecreateshortcut':4,'filedelete':4,'fileencoding':4,'fileinstall':4,'filegetattrib':4,'filegetshortcut':4,'filegetsize':4,'filegettime':4,'filegetversion':4,'filemove':4,'filemovedir':4,'fileread':4,'filereadline':4,'filerecycle':4,'filerecycleempty':4,'fileremovedir':4,'fileselectfile':4,'fileselectfolder':4,'filesetattrib':4,'filesettime':4,'finally':4,'for':4,'formattime':4,'getkeystate':4,'gosub':4,'goto':4,'groupactivate':4,'groupadd':4,'groupclose':4,'groupdeactivate':4,'gui':4,'guicontrol':4,'guicontrolget':4,'hotkey':4,'ifequal':4,'ifnotequal':4,'ifexist':4,'ifnotexist':4,'ifgreater':4,'ifgreaterorequal':4,'ifinstring':4,'ifnotinstring':4,'ifless':4,'iflessorequal':4,'ifmsgbox':4,'ifwinactive':4,'ifwinnotactive':4,'ifwinexist':4,'ifwinnotexist':4,'imagesearch':4,'inidelete':4,'iniread':4,'iniwrite':4,'input':4,'inputbox':4,'keyhistory':4,'keywait':4,'listhotkeys':4,'listlines':4,'listvars':4,'loop':4,'menu':4,'mouseclick':4,'mouseclickdrag':4,'mousegetpos':4,'mousemove':4,'msgbox':4,'onexit':4,'outputdebug':4,'pause':4,'pixelgetcolor':4,'pixelsearch':4,'postmessage':4,'process':4,'progress':4,'random':4,'regdelete':4,'regread':4,'regwrite':4,'reload':4,'return':4,'run':4,'runas':4,'runwait':4,'send':4,'sendraw':4,'sendinput':4,'sendplay':4,'sendevent':4,'sendlevel':4,'sendmessage':4,'sendmode':4,'setbatchlines':4,'setcapslockstate':4,'setcontroldelay':4,'setdefaultmousespeed':4,'setenv':4,'setformat':4,'setkeydelay':4,'setmousedelay':4,'setnumlockstate':4,'setscrolllockstate':4,'setregview':4,'setstorecapslockmode':4,'settimer':4,'settitlematchmode':4,'setwindelay':4,'setworkingdir':4,'shutdown':4,'sleep':4,'sort':4,'soundbeep':4,'soundget':4,'soundgetwavevolume':4,'soundplay':4,'soundset':4,'soundsetwavevolume':4,'splashimage':4,'splashtexton':4,'splashtextoff':4,'splitpath':4,'statusbargettext':4,'statusbarwait':4,'stringcasesense':4,'stringgetpos':4,'stringleft':4,'stringlen':4,'stringlower':4,'stringmid':4,'stringreplace':4,'stringright':4,'stringsplit':4,'stringtrimleft':4,'stringtrimright':4,'stringupper':4,'suspend':4,'switch':4,'sysget':4,'thread':4,'throw':4,'tooltip':4,'transform':4,'traytip':4,'try':4,'until':4,'urldownloadtofile':4,'while':4,'winactivate':4,'winactivatebottom':4,'winclose':4,'wingetactivestats':4,'wingetactivetitle':4,'wingetclass':4,'winget':4,'wingetpos':4,'wingettext':4,'wingettitle':4,'winhide':4,'winkill':4,'winmaximize':4,'winmenuselectitem':4,'winminimize':4,'winminimizeall':4,'winminimizeallundo':4,'winmove':4,'winrestore':4,'winset':4,'winsettitle':4,'winshow':4,'winwait':4,'winwaitactive':4,'winwaitnotactive':4,'winwaitclose':4,'global':3,'local':3,'static':3,'if':2,'#clipboardtimeout':1,'#commentflag':1,'#errorstdout':1,'#escapechar':1,'#hotkeyinterval':1,'#hotkeymodifiertimeout':1,'#hotstring':1,'#if':1,'#ifwinactive':1,'#ifwinexist':1,'#ifwinnotactive':1,'#ifwinnotexist':1,'#iftimeout':1,'#include':1,'#includeagain':1,'#inputlevel':1,'#installkeybdhook':1,'#installmousehook':1,'#keyhistory':1,'#maxhotkeysperinterval':1,'#maxmem':1,'#maxthreads':1,'#maxthreadsbuffer':1,'#maxthreadsperhotkey':1,'#menumaskkey':1,'#noenv':1,'#notrayicon':1,'#persistent':1,'#requires':1,'#singleinstance':1,'#usehook':1,'#warn':1,'#winactivateforce':1,'#ltrim':1}

export const assignmentOperators: stringIndexBool = {':=':true,'+=':true,'-=':true,'*=':true,'/=':true,'//=':true,'.=':true,'|=':true,'&=':true,'^=':true,'>>=':true,'<<=':true}
