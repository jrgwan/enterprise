module.exports = {

  documentation: {
    default: {
      files: [{
        src: ['js/*.js']
      }],
      options: {
        name: 'Soho XI Controls Docs',
        destination: 'docs',
        version: `v<%= pkg.version %>`,
        output: 'html',
        github: 'true'
      }
    },
  }

};
