t:="oooo"
ar:=["ahk_parser.js\tov2\splitpath.ahk"]
; SplitPath, % ar[1],, Ou%t%Dir,,firstOutNameNoExt
SplitPath % ar[1],, Ou%t%Dir,,firstOutNameNoExt
p(OuooooDir)
SplitPath % ar[1],, %t%,,firstOutNameNoExt
p(oooo)