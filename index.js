'use strict';

const MINUTE = 60000;
const MS_PER_SECOND = 1000;
const SECOND_PER_MINUTE = 60;
const MINUTE_PER_HOUR = 60;

window.onload = function() {
  Timer.run();
};

class Timer {
  static start;
  static intervalId;

  static run() {
    Timer.intervalId = setInterval(Timer.render, MINUTE);
    const savedValue = Timer.retrieveStart();

    Timer.start = new Date(savedValue);
    Timer.render();
  }

  static durationInMiliSeconds() {
    const now = new Date();
    return now - Timer.start;
  }

  static durationInSeconds() {
    return Timer.durationInMiliSeconds() / MS_PER_SECOND;
  }

  static durationInMinutes() {
    return Timer.durationInSeconds() / SECOND_PER_MINUTE;
  }

  static setStart(value) {
    const rawDuration = value;
    const durationInSeconds = Timer.parseDuration(rawDuration);
    const newTimerStart = new Date(new Date() - durationInSeconds * MS_PER_SECOND);

    Timer.saveStart(newTimerStart, () => {
      Timer.start = newTimerStart;
    });
  }

  static render() {
    const input = document.getElementById('duration-input');
    input.value = Timer.formatDuration(Timer.durationInSeconds());
  }

  // Private

  static saveStart(newStart, onSuccess) {
    const data = new FormData();
    data.append('new_start', newStart);
    const options = {
      url: '/user',
      type: 'patch',
      data,
      success: onSuccess
    };

    Rails.ajax(options);
  }

  static retrieveStart() {
    return document.querySelector('#timer-start').value;
  }

  static parseDuration(raw) {
    const number = parseFloat(raw.match(/\d*\.?\d*/)[0] || 0);

    if (raw.includes('s')) {
      return number;
    } else if (raw.includes('m')) {
      return number * 60;
    } else if (raw.includes('h')) {
      return number * 60 * 60;
    } else { // considering it minutes
      return number * 60;
    }
  }

  static formatDuration(seconds) {
    if (seconds === null || seconds === undefined) {
      return '0s';
    } else if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds >= 60 && seconds < 3600) {
      return `${Math.round(seconds / 60)}m`;
    } else if (seconds >= 3600) {
      return `${parseFloat((seconds / 60 / 60).toFixed(2))}h`;
    } else {
      return '0s';
    }
  }
}
