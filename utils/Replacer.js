const _ = require('lodash')

const tag_cleaner = (tag, open_tag, close_tag) =>
  tag.replace(open_tag, '').replace(close_tag, '')

const replaceSpecial = (text) => {
  // preserve newlines, etc - use valid JSON
  text = text
    .replace(/\\n/g, '\\n')
    .replace(/\\'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\\&/g, '\\&')
    .replace(/\\r/g, '\\r')
    .replace(/\\t/g, '\\t')
    .replace(/\\b/g, '\\b')
    .replace(/\\f/g, '\\f')
  // remove non-printable and other non-valid JSON chars
  text = text.replace(/[\u0000-\u0019]+/g, '')
  return text
}

const tags = [
  {
    tag: /\{\{(.*?)\}\}/g,
    open_tag: /^\{\{/,
    close_tag: /\}\}$/,
    resolver: function (data) {
      return (tag) =>
        _.get(data, tag_cleaner(tag, this.open_tag, this.close_tag))
    },
  },
]

/**
 *
 * @param {String} text the string to be processed
 * @param {Object} source_data {} object that contains the source data
 * @returns {String} processed string
 */
const replace = (text, source_data = {}) => {
  let new_text = text + ''

  tags.forEach((ftag) => {
    new_text = new_text.replace(ftag.tag, ftag.resolver(source_data))
  })
  return replaceSpecial(new_text)
}

module.exports = replace
