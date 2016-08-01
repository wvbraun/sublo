"use strict";

import fetch from "isomorphic-fetch";
import request from "superagent";

const paths = {
  baseUrl: "/api/clyp"
};

const configHandler = (method, body = null) => {
  let config = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }
  };

  if (body) {
    config.body = body;
  }
  return config;
};

class ClypApi {
  static getAllPlaylists() {
      return new Promise((resolve, reject) => {
        fetch("/api/clyp/playlists")
          .then((response) => {
              return response.json();
          })
          .then((playlists) => {
            resolve(Object.assign([], playlists));
          })
          .catch((error) => {
            throw(error);
          });
      });
  }

  static getAllTracks() {
    return new Promise((resolve, reject) => {
      fetch('/api/clyp/tracks')
        .then((response) => {
          return response.json();
        })
        .then((tracks) => {
          resolve(Object.assign([], tracks));
        })
        .catch((error) => {
          throw(error);
        });
    });
  }

  static savePlaylist(playlist) {
    let _playlist = Object.assign({}, playlist);
    let config = {
      method: "POST",
      body: JSON.stringify(_playlist),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    };

    return new Promise((resolve, reject) => {
      fetch("/api/clyp/playlist", config)
        .then((response) => {
          return response.json();
        })
        .then((savedPlaylist) => {
          const minLength = 1;
          if (savedPlaylist.Title.length < minLength) {
            reject(`Name must be at least ${minLength} characters.`);
          } else {
            resolve(Object.assign({}, savedPlaylist));
          }
        })
        .catch((error) => {
          throw(error);
        });
    });
  }

  static saveTrack(track) {
    /*
    track = Object.assign({},
      { preview: track.preview,
        name: track.name,
        size: track.size,
        lastModified: track.lastModified,
        lastModifiedDate: track.lastModifiedDate,
        type: track.type,
        webkitRelativePath: track.webkitRelativePath
      });
    let tmp = JSON.stringify(track);
    */
    let form = new FormData();
    form.append('audioFile', track);
    let tmp = form.get('audioFile');
    debugger;
    let settings = {
      method: 'POST',
      body: form
    };


    return new Promise((resolve, reject) => {
      fetch("/api/clyp/upload", settings)
        .then((response) => {
          return response.json();
        })
        .then((savedTrack) => {
          const minLength = 1;
          if (savedTrack.Title.length < minLength) {
            reject(`Name must be at least ${minLength} characters.`);
          } else {
            resolve(Object.assign({}, savedTrack));
          }
        })
        .catch((error) => {
          throw(error);
        });
    });
  }
}

export default ClypApi;
