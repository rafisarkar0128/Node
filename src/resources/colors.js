module.exports = {
  // red or red-ish colors
  LightCoral: "#F08080",
  Salmon: "#FA8072",
  DarkSalmon: "#E9967A",
  LightSalmon: "#FFA07A",
  Crimson: "#DC143C",
  Red: "#FF0000",
  FireBrick: "#B22222",
  DarkRed: "#8B0000",
  AmericanRose: "#FF033E",

  // pink or pink-ish colors
  Pink: "#FFC0CB",
  LightPink: "#FFB6C1",
  HotPink: "#FF69B4",
  DeepPink: "#FF1493",

  // orange or orange-ish colors
  Coral: "#FF7F50",
  OrangeRed: "#FF4500",
  DarkOrange: "#FF8C00",
  Orange: "#FFA500",

  // yellow or yellow-ish colors
  Gold: "#FFD700",
  Yellow: "#FFFF00",
  LightYellow: "#FFFFE0",
  PapayaWhip: "#FFEFD5",
  Moccasin: "#FFE4B5",
  PeachPuff: "#FFDAB9",
  PaleGoldenrod: "#EEE8AA",
  Khaki: "#F0E68C",

  // violet or violate-ish colors
  Lavender: "#E6E6FA",
  Plum: "#DDA0DD",
  Violet: "#EE82EE",
  Orchid: "#DA70D6",
  Magenta: "#FF00FF",
  BlueViolet: "#8A2BE2",
  DarkViolet: "#9400D3",
  Purple: "#800080",
  Indigo: "#4B0082",
  SlateBlue: "#6A5ACD",
  DarkSlateBlue: "#483D8B",

  // green or green-ish colors
  GreenYellow: "#ADFF2F",
  LawnGreen: "#7CFC00",
  Lime: "#00FF00",
  LimeGreen: "#32CD32",
  PaleGreen: "#98FB98",
  LightGreen: "#90EE90",
  AndroidGreen: "#32de84",
  MediumSpringGreen: "#00FA9A",
  SpringGreen: "#00FF7F",
  SeaGreen: "#2E8B57",
  ForestGreen: "#228B22",
  Green: "#008000",
  DarkGreen: "#006400",
  YellowGreen: "#9ACD32",
  Olive: "#808000",
  MediumAquamarine: "#66CDAA",
  LightSeaGreen: "#20B2AA",
  DarkCyan: "#008B8B",

  // blue or blue-ish colors
  Aqua: "#00FFFF",
  Cyan: "#00FFFF",
  LightCyan: "#E0FFFF",
  Aquamarine: "#7FFFD4",
  Turquoise: "#40E0D0",
  DarkTurquoise: "#00CED1",
  SteelBlue: "#4682B4",
  PowderBlue: "#B0E0E6",
  LightBlue: "#ADD8E6",
  SkyBlue: "#87CEEB",
  LightSkyBlue: "#87CEFA",
  DeepSkyBlue: "#00BFFF",
  DodgerBlue: "#1E90FF",
  CornflowerBlue: "#6495ED",
  RoyalBlue: "#4169E1",
  Blue: "#0000FF",
  DarkBlue: "#00008B",
  Navy: "#000080",
  MidnightBlue: "#191970",

  // brown or brown-ish colors
  Cornsilk: "#FFF8DC",
  Bisque: "#FFE4C4",
  Wheat: "#F5DEB3",
  BurlyWood: "#F5DEB3",
  SandyBrown: "#F4A460",
  Chocolate: "#D2691E",
  Brown: "#A52A2A",
  Maroon: "#800000",

  // white or white-ish colors
  White: "#FFFFFF",
  Snow: "#FFFAFA",
  HoneyDew: "#F0FFF0",
  MintCream: "#F5FFFA",
  Azure: "#f0ffff",
  WhiteSmoke: "#F5F5F5",
  SeaShell: "#FFF5EE",
  FloralWhite: "#FFFAF0",
  LavenderBlush: "#FFF0F5",
  MistyRose: "#FFE4E1",

  // gray or gray-ish colors
  LightGray: "#D3D3D3",
  Silver: "#C0C0C0",
  DarkGray: "#A9A9A9",
  Gray: "#808080",
  DimGray: "#696969",
  LightSlateGray: "#778899",
  SlateGray: "#708090",
  DarkSlateGray: "#2F4F4F",
  Black: "#000000",

  // extra colors
  Main: "#90B63E",
  Good: "#74a371",
  Giveaway: "#FFAF00",
  Standby: "#dedc5d",
  Wrong: "#de5d5d",
  Error: "#E3C647",
  Transparent: "#36393F",
  Warning: "#F7E919",
  Normal: "#5865F2",
  Discord: "#7289DA",

  /**
   * Returns a random color from the color object
   * @returns {string}
   * @example client.color.getRandom();
   */
  getRandom() {
    const colorArray = Object.values(this).filter((v) => typeof v === "string");
    return colorArray[Math.floor(Math.random() * colorArray.length)];
  }
};
