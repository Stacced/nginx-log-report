<h1 align="center">Welcome to nginx-log-report 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/Stacced/nginx-log-report#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/Stacced/nginx-log-report/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/Stacced/nginx-log-report/blob/master/LICENSE" target="_blank">
    <img alt="License: GPL--3.0" src="https://img.shields.io/github/license/Stacced/nginx-log-report" />
  </a>
  <a href="https://twitter.com/Stackeed" target="_blank">
    <img alt="Twitter: Stackeed" src="https://img.shields.io/twitter/follow/Stackeed.svg?style=social" />
  </a>
</p>

> App that reads a NGINX logfile and generates a HTML file displaying a map plotting every machine that accessed the server, aswell as access count for each country and successful requests
>
> The app uses GeoLite2 IP database from MaxMind to geolocate source countries and cities.
> I didn't include it here, because I'm unsure about legal stuff since it required sign-up
> on their website. It is free to download.

### 🏠 [Homepage](https://github.com/Stacced/nginx-log-report)

## Install

```sh
npm install
```

## Usage

```sh
npm run start logfile.log GeoLite2City.mmdb
```

## Author

👤 **Stacked**

* Website: lancehead.ch
* Twitter: [@Stackeed](https://twitter.com/Stackeed)
* Github: [@Stacced](https://github.com/Stacced)

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2020 [Stacked](https://github.com/Stacced).<br />
This project is [GPL--3.0](https://github.com/Stacced/nginx-log-report/blob/master/LICENSE) licensed.

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_