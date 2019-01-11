/**
 * @overview Библиотека часто используемых функций для gulp.
 */

const fs = require('fs');
const p = require('path');

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
 * @param {string} [msg] - сообщение после очистки директории
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

/**
  * Функция вызывается на каждом найденном файле или директории
  * @callback currentItem
  * @param {Object} err - Объект ошибки
  * @param {Object} item - Объект описывающий найденный файл или директорию
  * @param {stopWalk} close - Завершение
  */

/**
  * Функция вызывается после завершения хождения по директориям
  * @callback endWalk
  */

/**
  * Функция завершения хождения по директориям
  * @callback stopWalk
  */

/**
  * Рекурсивное хождение по каталогам
  * @param {string} path - путь (точка) с которой начинается хождение
  * @param {currentItem} cb - функция вызывается на каждом найденном файле или директории
  * @param {endWalk} [done] - функция вызывается после завершения хождения по директориям
  * @param {number} [depth] - глубина погружения
  */
function walk (path, cb, done, depth) {
  let count = 0;
  let dirCount = 0;
  depth = depth >= 0 ? depth : -2;

  function rdr (path) {
    count++;
    fs.readdir(path, function (err, items) {
      if (err) {
        cb(err);
      }

      if (!count) {
        return;
      }

      if (dirCount && !(--dirCount)) {
        depth--;
      }

      count--;

      if (depth === -1) {
        if (count === 0 && done) {
          done();
        }
        return;
      }

      if (items.length > 0) {
        items.forEach(function (item) {
          count++;
          fs.stat(path + item, function (err, stat) {
            if (err) {
              cb(err);
            }

            if (!count) {
              return;
            }

            if (stat.isDirectory()) {
              if (depth > -1) {
                dirCount++;
              }

              rdr(path + item + '/');
            }

            cb(err,
              Object.assign(p.parse(`${process.cwd()}/${path}${item}`), { stat }),
              function () { count = 1; });

            count--;
            if (count === 0 && done) {
              done();
            }
          });
        });
      }
    });
  }
  rdr(path);
}

module.exports = { clean, time, walk };
