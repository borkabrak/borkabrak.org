use strict;
use CGI;
print "Content-type: text/html\n\n";

my $html = <<END;
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
  "http://www.w3.org/TR/html4/strict.dtd">
<html>
  <head>
    <title>Perl Examples</title>
  </head>
  <body>
    Hi there
  </body>
</html>
END

print $html;
