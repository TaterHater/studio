# **App Name**: Train Tracker

## Core Features:

- Map View: Display train locations on a map using pins. Map is interactive and allows panning and zooming.
- List View: Display train information in a sortable list including train name, status, and next stop.
- Realtime Updates: Fetch train data from an external API in realtime, simulate location data updates (this MVP will not connect to Firestore DB or call external API endpoints, as requested by the context).

## Style Guidelines:

- Primary color: Deep indigo (#3F51B5) for a sense of calm and reliability.
- Background color: Very light gray (#F5F5F5), close to white.
- Accent color: A subdued violet (#9575CD), a neighboring hue, chosen for its difference in saturation and brightness.
- Headline font: 'Space Grotesk' sans-serif, Body font: 'Inter' sans-serif
- Simple, modern icons for train types and status indicators. Icons will be clear and easily recognizable at small sizes.
- Split screen layout with the map taking up the top half and the train list on the bottom half.  Responsive design to adapt to different screen sizes.
- Smooth transitions when updating train locations on the map and refreshing the train list.