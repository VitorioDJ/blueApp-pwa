// blue.js
// Blue App JS functions

// Get all audio players
let players = document.querySelectorAll('audio.player');
let playersMedit = document.querySelectorAll('audio.meditation');
let playersSound = document.querySelectorAll('audio.soundscape');
let playersMusic = document.querySelectorAll('audio.music');

let currentlyPlaying1 = [];
let wasPlaying = [];

let isMuted = false; // Track mute state
let isPlaying = false; // Track paused state


// Function to update Mute, Play, Rnd Icons
function updateMuteIcon() {
    const currIcon = document.getElementById('mute-icon');

    currIcon.classList.remove('fa-volume-mute', 'fa-volume-up');
    if (isMuted) {
        currIcon.classList.add('fa-volume-mute');
    } else {
        currIcon.classList.add('fa-volume-up');
    }
}

function updatePlayIcon() {
    const currIcon = document.getElementById('play-icon');

    currIcon.classList.remove('fa-play', 'fa-pause');
    if (isPlaying) {
        currIcon.classList.add('fa-pause');
    } else {
        currIcon.classList.add('fa-play');
    }
}

function updateRndIcon() {
    const currIcon = document.getElementById('rnd-icon');

    currIcon.classList.remove('fa-dice', 'fa-stop');
    if (isPlaying) {
        currIcon.classList.add('fa-stop');
    } else {
        currIcon.classList.add('fa-dice');
    }
}


// Function to toggle Mute
function toggleMute() {
    isMuted = !isMuted; // Toggle mute state

    // Set volume (MUTE / UNMUTE) for audio players
    players.forEach(audioPlayer => {
        audioPlayer.volume = isMuted ? 0 : 1; // Mute or unmute
    });

    updateMuteIcon();

}

// Add event listener to the mute toggle menu item
document.getElementById('mute-toggle').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    toggleMute(); // Call the toggle mute function
});


//---------------------------
// BEGIN Play / Pause Players
//

function togglePlaying(playType) {
    // Pause or resume audio players
    if (isPlaying) {
        players.forEach(audio => {
            audio.addEventListener('play', () => {
                // Add the audio element to the currentlyPlaying array
                currentlyPlaying.push(audio);
            });
        });

        if (playType == 'ply') {
            wasPlaying = pauseAllAudio();
        } else {
            wasPlaying = stopAllAudio();
        }

    } else if (playType == 'rnd') {
        // Play RANDOM audio player
        playRandom();

    } else if (playType == 'ply') {
        if (wasPlaying.length > 0) {
            resumeAllAudio(wasPlaying);
        } else {
            playRandom();
        }

    }

    isPlaying = !isPlaying; // Toggle playing state

    updateRndIcon();
    updatePlayIcon();

}


//----------------
// EVENT Listeners
//----------------

// Add event listener to RND icon
document.getElementById('rnd-toggle').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    togglePlaying('rnd'); // Call the toggle playing function
});

// Add event listener to PLAY icon
document.getElementById('play-toggle').addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default anchor behavior
    togglePlaying('ply'); // Call the toggle playing function
});


// Add event listener to EACH AUDIO PLAYER - toggle main Play icon
players.forEach(player1 => {
    player1.addEventListener('play', () => {
        // Reset and add the currently playing player
        currentlyPlaying1 = [player1];
        isPlaying = true;

        updateRndIcon();
        updatePlayIcon();
    });

    player1.addEventListener('pause', () => {
        // Remove from currently playing
        currentlyPlaying1 = currentlyPlaying1.filter(p => p !== player1);
        // Update icon if no players are currently playing
        if (currentlyPlaying1.length === 0) {
            isPlaying = false;

            updateRndIcon();
            updatePlayIcon();
        }
    });

});



// Function to play RANDOM MUSIC player
function playRandom() {
    // First re-wind ALL players
    players.forEach(audio => {
        audio.currentTime = 0;
    });

    const rndIndex = Math.floor(Math.random() * (playersMusic.length + 1));
    const currentPlayer = playersMusic[rndIndex];

    currentPlayer.play();

}

// Function to PAUSE all audio players
function pauseAllAudio() {
    const wasPlaying = Array.from(players).filter(audio => !audio.paused);

    players.forEach(audioPlayer => {
        audioPlayer.pause();
    });

    return wasPlaying;
}

// Function to STOP all audio players
function stopAllAudio() {
    const wasPlaying = Array.from(players).filter(audio => !audio.paused);

    players.forEach(audioPlayer => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0; // Reset the playhead to the beginning
    });

    return wasPlaying;
}

//Function to RESUME all paused audio players (t > 0) (MAX 2 players)
function resumeAllAudio(wasPlaying) {
    wasPlaying.forEach(audio => {
        audio.play();
    });
}


// Function to SMART-PAUSE all audio players
function pauseSmartOtherAudio(selectedPlayer) {
    const audioElements = document.querySelectorAll('audio');
    const playingAudioPlayers = Array.from(audioElements).filter(audio => !audio.paused);
    let currentPlayer = playingAudioPlayers[0];

    // console.log(selectedPlayer);
    // console.log(currentPlayer);
    // console.log(playingAudioPlayers);
    // console.log('Total playing Players =', playingAudioPlayers.length);

    if (playingAudioPlayers.length > 2) {
        players.forEach(otherPlayer => {
            if (otherPlayer !== selectedPlayer) {
                otherPlayer.pause();
            }
        });
    } else if (playingAudioPlayers.length == 2) {
        if (playingAudioPlayers[0].classList.contains('soundscape') && playingAudioPlayers[1].classList.contains('meditation')) {
            // console.log('Soundscape + Meditation -> keep playing');
        } else if (playingAudioPlayers[0].classList.contains('meditation') && playingAudioPlayers[1].classList.contains('soundscape')) {
            // console.log('Meditation + Soundscape -> keep playing');
        } else {
            players.forEach(otherPlayer => {
                if (otherPlayer !== selectedPlayer) {
                    otherPlayer.pause();
                }
            });
        }
    } else {
        if (selectedPlayer.classList.contains('soundscape') && currentPlayer.classList.contains('meditation')) {
            // console.log('Soundscape + Meditation -> keep playing');
        } else if (selectedPlayer.classList.contains('meditation') && currentPlayer.classList.contains('soundscape')) {
            // console.log('Meditation + Soundscape -> keep playing');
        } else {
            players.forEach(otherPlayer => {
                if (otherPlayer !== selectedPlayer) {
                    otherPlayer.pause();
                }
            });
        }

    }

}


// Add event listener to each audio player
players.forEach(player => {
    player.addEventListener('play', () => {
        // Pause SMART all other audio players
        pauseSmartOtherAudio(player);
    });
});


//
// END Play / Pause Players
//-------------------------


// Function to skip playhead forward or backward
function skipMedia(event) {
    const activeAudioPlayer = Array.from(players).find(player => !player.paused);

    if (event.key === 'ArrowRight') {
        // Skip forward 10 seconds for the active audio player
        if (activeAudioPlayer) {
            activeAudioPlayer.currentTime = Math.min(activeAudioPlayer.duration, activeAudioPlayer.currentTime + 10);
        }
    } else if (event.key === 'ArrowLeft') {
        // Skip backward 10 seconds for the active audio player
        if (activeAudioPlayer) {
            activeAudioPlayer.currentTime = Math.max(0, activeAudioPlayer.currentTime - 10);
        }
    }
}


// Handle Logo Fade-In Fade-Out
const logo = document.getElementById('logo');
const subTitle = document.getElementById('sub-title');

// Function to reset opacity on click
function resetOpacity() {
    logo.style.opacity = '1';
    subTitle.style.opacity = '1';
    logo.classList.remove('fade-effect');
    subTitle.classList.remove('fade-effect');

    // Restart the fade-out effect after a short delay
    setTimeout(() => {
        logo.classList.add('fade-effect');
        subTitle.classList.add('fade-effect');
    }, 100); // Delay to allow the opacity to reset
}

// Add click event listener
logo.addEventListener('click', resetOpacity);
subTitle.addEventListener('click', resetOpacity);



// Function to add a new video to bg-holder
function addVideo(videoSrc) {
    // Create a new video element
    var newVideo = document.createElement('video');
    newVideo.className = 'bg-video'; // Add the same class for styling
    newVideo.autoplay = true; // Set autoplay
    newVideo.loop = true; // Set loop
    newVideo.muted = true; // Set muted

    // Create a source element for the new video
    var source = document.createElement('source');
    source.src = videoSrc; // Set the source URL
    source.type = 'video/mp4'; // Set the type

    // Append the source to the video element
    newVideo.appendChild(source);

    // Append the new video to the div
    var bgHolder = document.querySelector('.bg-holder');
    bgHolder.appendChild(newVideo);
}


// Add event listeners to dropdown items
const dropdownItems = document.querySelectorAll('.dropdown-item');
dropdownItems.forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default anchor behavior
        const videoSrc = item.getAttribute('data-video-src');
        addVideo(videoSrc); // Call the addVideo function with the video source
    });
});


// On Loading the page -> MAX all AUDIO players
window.onload = function () {
    // Select all audio elements on the page
    const audioElements = document.querySelectorAll('audio');

    // Set the volume of each audio element to maximum (1.0)
    audioElements.forEach(audio => {
        audio.volume = 1.0; // Set volume to maximum
    });
};



// Event Listener on Dropdown Menu icon (only mobile)
document.getElementById('navbarToggle').addEventListener('click', function() {
    const icon = this.querySelector('.navbar-open-icon');
    if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close the entire navbar on small screens when a dropdown item is clicked
// document.querySelectorAll('.dropdown-item').forEach(item => {
//     item.addEventListener('click', function () {
//         // Collapse the navbar
//         const navbarCollapse = document.getElementById('navbarSupportedContent');
//         if (navbarCollapse) {
//             navbarCollapse.classList.remove('show');
//             const navbarToggle = document.getElementById('navbarToggle');
//             if (navbarToggle) {
//                 navbarToggle.classList.add('collapsed');
//                 navbarToggle.setAttribute('aria-expanded', 'false');
//             }
//         }
//     });
// });
