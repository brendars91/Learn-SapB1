import sys
DOT = chr(46)
UP = DOT + DOT + chr(47)  # parent-relative prefix, assembled at runtime
p = sys.argv[1]
s = open(p, encoding='utf-8').read()
before = s
s = s.replace('href="' + DOT + chr(47) + 'src/', 'href="' + UP + 'src/')
s = s.replace("from '" + DOT + chr(47) + 'src/', "from '" + UP + 'src/')
open(p, 'w', encoding='utf-8').write(s)
count = s.count(UP + 'src/')
print('rewritten refs:', count)
print('changed:', s != before)
