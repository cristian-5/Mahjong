
# 🀄️ Mahjong Western Special Hands

A comprehensive list of Mahjong special hands, made with ❤️.
Graphics by [Cangjie6](https://demching.itch.io/mahjong) 💝.

> Note that the adopted score for a given hand has been calculated
> according to the probability of gaining that hand randomly.

The mahjong suits are **bamboo**, **characters**, **circles** (or **dots**),
**winds**, **dragons**, **seasons** and **flowers** (used as jokers).
There 9 numbered tiles for **bamboo**, **characters** and **circles**,
4 **winds** (East, South, West, North) and 3 **dragons** (Red, Green, White).
For each tile type there are 4 copies, for a total of 144 tiles.

A **hand** is constituted by 14 tiles, grouped together in **combo**s.\
A **combo** can be described as:
- **run** - n tiles in sequence
- **chow** - 3 tiles of the same suit in sequence
- **mixed chow** - 3 tiles in sequence, one from each suit
- **kong** - 4 identical tiles
- **pung** - 3 identical tiles
- **pair** - 2 identical tiles
- **mixed pair** - 2 tiles of different suits

## Hand Format

The hands are specified in the `hands.json` file with the following structure:

```ts
type Localized<T> = { [language: string]: T };
type Hand = {
	name: Localized<string> | string,
	description?: Localized<string> | string,
	score: number, // 500 ... 2000
	example: ExampleHand,
	info?: Localized<string[]> | string[],
	blanks?: Localized<string[]> | string[]
}
```

Localization is useful when different strings are used for different languages.

Strings might be markdown-formatted, with the following rules:

- **bold** - `*bold*`
- _italic_ - `_italic_`
- newlines - `\n`

The `info` property is used to write information under each combo.\
The `blanks` property is used to write information in empty tiles.

### Example Hand Format

The example hand is a **case-sensitive** string of combos,
separated by whitespace, containing 14 tiles.

- Each tile is represented by 2 characters,
suit (`B`, `C`, `O`, `D`, `W`, `F`, `S`) where `O` is **circles**,
and number (`1` ... `9`) or variant (`E`, `S`, `W`, `N` for winds
`R`, `G`, `W` for dragons).
- If the wind is **own**, the suit is lowercased: `w`.
- If the dragon is **corresponded**, the suit is lowercased: `d`.
- If the dragon is **specific**, the variation is lowercased: `r`.
- Blank tiles are represented by `#` followed by their 1-based index.

- **Corresponded** Dragons use the marker `‡` and **bold**.
- **Own** Winds use the marker `†` and **bold**.
- Specific Dragons, Winds or Tiles, do not use any marker but use **bold**.

`WEWSWWWN #1 B1B1B1 O1O1O1 C1C1C1`\
`C2C3 C4C4 C6C6 C8C8 C9C9C9 dRdRdR`\
`C1C2C3C4C5C6C7 #1 DwDwDw DrDrDr`
