import React from 'react';

const Html = (props) => {
  return (
      <html>
      <head>
        <title>App</title>
      </head>
      <body>
      <div id="app">{props.children}</div>
      <!-- Load React. -->
      <!-- Note: when deploying, replace "development.js" with "production.min.js". -->
      <script src="https://unpkg.com/react@16/umd/react.production.min.js" crossorigin></script>
      <script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js" crossorigin></script>
      </body>
      </html>
  );
};

export default Html;