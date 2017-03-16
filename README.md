<h1 align="center">React Ocean App (under development)<h1/>

<p align="center">
    <img src ="public/demo.gif" />
</p>

## Synopsis

A front-end Oceanography webapp built with React, Redux, and Plotly.js. Meant to be served by the [Ocean App Server](https://github.com/hardinthepaints/ocean-app-server).

## Installation

1. Follow directions to install the [Ocean App Server](https://github.com/hardinthepaints/ocean-app-server)
2. Download this repository to [app/static/webapp](https://github.com/hardinthepaints/ocean-app-server/tree/master/app/static/Webapp/) in the ocean-app-server file structure.


## Usage

1. Choices:  
* Run the Ocean App Server and go to [http://localhost:5000/app/static/webapp/react-ocean-app/build/index.html](http://localhost:5000/app/static/webapp/react-ocean-app/build/index.html)  
* Run your own server to serve the files in /build


## Task List
- [ ] Snapshot tests for React components
- [ ] Make graph adhere to aspect ratio
- [ ] Layered 3d chart which shows shape of layers.
- [ ] Add streaming capability
- [ ] Pre-load frames
- [ ] Show frame data like hour or data
- [ ] Display data on MapBox map
- [ ] Frame scrubber should reflect range limit
- [ ] Frame scrubber should show which frames have loaded
- [ ] Display loader spinner on not-yet-fetched frames
- [ ] Play toggle should be larger

## Notes
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## License

MIT



