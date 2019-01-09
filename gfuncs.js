/**
 * @overview Библиотека часто используемых функций для gulp.
 */

const fs = require('fs');

/**
 * Текущее время
 * @return {string} - текущее время в формате hh:mm:ss
 */
function time () {
  let locale = process.env.LANGUAGE.replace('_', '-');
  let options = {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };

  return `[${new Date().toLocaleString(locale, options)}]`;
}

/**
 * Рекурсивная очистка директории
 * @param {string} path - путь к директории
 * @param {string} [msg] - сообщение для печати после очистки директории
 */
const clean = function clr (path, msg) {
  let files;
  try {
    fs.accessSync(path);
    files = fs.readdirSync(path);
  } catch (e) {
    console.log(`${time()} No such file or directory ${process.cwd()}/${path}`);
    return;
  }

  if (files.length > 0) {
    files.forEach(function (item) {
      let stats = fs.statSync(path + item);

      if (stats.isFile()) {
        fs.unlinkSync(path + item);
      } else if (stats.isDirectory()) {
        if (fs.readdirSync(path + item).length > 0) {
          clr(path + item + '/');
          fs.rmdirSync(path + item);
        } else {
          fs.rmdirSync(path + item);
        }
      }
    });
    if (msg) {
      console.log(msg);
    }
  } else {
    console.log(`${time()} Nothing to clean in directory ${process.cwd()}/${path}`);
  }
};

module.exports = { clean: clean, time: time };
