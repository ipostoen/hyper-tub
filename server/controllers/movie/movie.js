const _ = require('lodash');
const torrentStream = require('torrent-stream');
const OS = require('opensubtitles-api');

const srt2vtt = require('srt-to-vtt')
const fs = require('fs')
const pump = require('pump')
const axios 	= require('axios');
const mkdirp = require('mkdirp');
const path = require('path');

const OpenSubtitles = new OS({
    useragent:'TemporaryUserAgent',
    username: 'bosya1996',
    password: 'q1w2e3a1s2d3',
    ssl: true
});

const NGINX = "http://localhost:3000"
const SUBTITLE_STORAGE = path.join(__dirname + '../../../subtitles/')

const getFile = async (srtDownloadUrl, filename) => {
    // download srt and convert it into vtt file
    const response = await axios({
        method: 'GET',
        url: srtDownloadUrl,
        responseType: 'stream'
    })

    console.log('FOLENAME', filename)
    filename = filename.replace('.dxva-wsp®', '').replace(' ', '.').replace('.srt', '.vtt')
    var subtitleFile = SUBTITLE_STORAGE + filename
    // subtitleFile = subtitleFile.replace('.srt', '.vtt')

    const localFileWriteStream = fs.createWriteStream(subtitleFile);

    localFileWriteStream.on("open", () => {
        pump(response.data, srt2vtt(), localFileWriteStream, (err) => {
            if (err) {
                return 'error'
            }
        });
    });

    let file = NGINX+'/subtitles/'+filename

    return file
}

const getSubtitle = async (imdbid, locale) => {
    await mkdirp(SUBTITLE_STORAGE, function (err) {
        if (err) console.error(err)
        else console.log(SUBTITLE_STORAGE, 'folder created')
    });

    const resp = await OpenSubtitles.search({
        imdbid
    })

    if (resp.en) {
        var en = {
            locale: "en",
            lable: "English",
            srtDownloadUrl: resp.en.url,
            file: await getFile(resp.en.url, resp.en.filename)
        }
    }

    if (resp.ru) {
        var ru = {
            locale: "ru",
            lable: "Russian",
            srtDownloadUrl: resp.ru.url,
            file: await getFile(resp.ru.url, resp.ru.filename)
        }
    }
    var subsArray = {en, ru}
    console.log(subsArray);
    return subsArray
}


var getFilm = async (req, res) => {
  console.log('req.params',req.query);
  let params = _.pick(req.query, ['id', 'lang']);
  try {
    let filmInf = await getFilmInf(params.id, params.lang);
    let torrents = await getTorrent(filmInf.imdb_id);
    let subtitle = await getSubtitle(filmInf.imdb_id);

    let result = {
      torrents: torrents.torrents,
      backdrop_path: filmInf.backdrop_path,
      grade: filmInf.vote_average,
      title: filmInf.title,
      genres: filmInf.genres,
      credits: filmInf.credits,
      overview: filmInf.overview,
      poster_path: filmInf.poster_path,
      similar: filmInf.similar,
      runtime: filmInf.runtime,
      videos: filmInf.videos,
      release_date: filmInf.release_date,
      subtitle
    };
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};

var getTorrent = (id) => axios.get(`https://tv-v2.api-fetch.website/movie/${id}`)
  .then(res => {
    return res.data;
  })
  .catch(err => {
    return Promise.reject(err.response.data);
  });

var getFilmInf = async (id, lang) => {
  let url = `https://api.themoviedb.org/3/movie/${id}`;
  let params = {
    language: lang,
    api_key: 'd96c3ae03928c2015a56ae5119d87782',
    append_to_response: 'videos,images,credits,similar,recommendations'
  }
  return axios.get(url, { params })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return Promise.reject(err.response.data);
    });
}

var getGenresList = async (lang) => {
  let url = 'https://api.themoviedb.org/3/genre/movie/list';
  let params = {
    api_key: 'd96c3ae03928c2015a56ae5119d87782',
    language: lang
  }
  return axios.get(url, { params })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return Promise.reject(err.response.data);
    });
}

var getFilmByName = async (lang, name) => {
  let url = 'https://api.themoviedb.org/3/search/movie';
  let params = {
    language: lang,
    api_key: 'd96c3ae03928c2015a56ae5119d87782',
    include_adult: false,
    query: name
  }
  return axios.get(url, { params })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return Promise.reject(err.response.data);
    });
}

var getStream = (req, res) => {
  var link = decodeURIComponent(req.params.magnet);
  var engine = torrentStream(link);
  engine.on('ready', function () {
    var stream = engine.files.reduce((file1, file2) => file1.length > file2.length ? file1 : file2);
    var range = req.headers.range ? req.headers.range.substring(6).split('-') : [0, stream.length - 1];
    var start = parseInt(range[0]),
      end = parseInt(range[1] || stream.length - 1);
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stream.length}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
      'Content-Type': 'video/mp4'
    });

    stream.createReadStream({ start: start, end: end }).pipe(res);
  });
}

var getFilmsList = async (map) => {
  let url = 'https://api.themoviedb.org/3/discover/movie';
  let params = {
    api_key: 'd96c3ae03928c2015a56ae5119d87782',
    include_adult: false
  }

  Object.keys(map).forEach(key => {
    const val = map[key];
    params[key] = val;
  });

  console.log(params);


  return axios.get(url, { params })
    .then(res => {
      return res.data;
    })
    .catch(err => {
      return Promise.reject(err.response.data);
    });
}

var test = async () => {
  // 	sort_by							сортировка
  // 	popularity.desc 				по популярности
  //  vote_average.desc 				по средней оценке
  //  primary_release_date.desc		дата создания сначало самые новые
  //  primary_release_date.asc		дата создания сначало самые старые
  var map = {
    'language': 'ru',
    'page': 1,
    'primary_release_year': 2011,
    'with_genres': 36,
    'primary_release_date.gte': 2010,
    'primary_release_date.lte': 2013,
    'sort_by': 'vote_average.desc'
  }
  let test = await getFilmsList(map);
  console.log(test);
}

module.exports = {
  getFilm,
  getStream
}



