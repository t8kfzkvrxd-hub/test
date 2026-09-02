export const assets = {
  backgrounds: {
    station: "assets/backgrounds/ame_miya_station_rainy_platform.png",
    arrival: "assets/backgrounds/phantom_train_arrival.png",
    interior: "assets/backgrounds/phantom_train_interior.png",
    door: "assets/backgrounds/phantom_train_open_door.png",
    passengers: "assets/backgrounds/phantom_train_passengers.png",
    oblivion: "assets/backgrounds/oblivion_town_platform.png"
  },
  events: {
    windowPassengers: "assets/events/phantom_train_window_passengers_v3.png",
    uniformEvent: "assets/events/uniform_girl_train_conversation.png",
    reunion: "assets/events/oblivion_girl_reunion_v6.png",
    reflection: "assets/events/reflection_girl_foreshadowing.png",
    missedTrainPhone: "assets/events/missed_last_train_phone.png",
    headlights: "assets/events/blank_board_train_headlights.png",
    noSignal: "assets/events/no_signal_map.png",
    departure: "assets/events/oblivion_departure.png",
    oblivionEyeContact: "assets/events/oblivion_girl_eye_contact_v1.png",
    oblivionClosingDoors: "assets/events/oblivion_girl_closing_doors_v1.png"
  },
  characters: {}
};

export const sceneAssets = { ...assets.backgrounds, ...assets.events };

export const rainBackgrounds = new Set([
  "station", "headlights", "arrival", "windowPassengers", "door",
  "oblivion", "reunion", "departure", "missedTrainPhone",
  "oblivionEyeContact", "oblivionClosingDoors"
]);
