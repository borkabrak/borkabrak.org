<html>
  <head>
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="tabby/style.css" />
    <script type="text/javascript" src="scripts/jquery-1.4.2.js"></script>
    <script type="text/javascript" src="tabby/tabby.js"></script>

    <title>Welcome</title>

  </head>

  <body class="light">

    <div id="tabby"></div> 

    <script type="text/javascript" >
      // Initialize tab list
      // Call tabby to create the tab list inside the given element
      Tabby("tabby", {

        "tabs": {
          'welcome': 'tabby/welcome.html',
          'overview': 'tabby/overview.html',
          'how to': 'tabby/howto.html',
          'example': 'tabby/example.html',
          'options': 'tabby/options.html',
          'bugs/todo': 'tabby/bugs.html',
          'download': 'tabby/download.html',
        },

        "defaulttab": "welcome",

      }); 

    </script>

  </body>

</html>
