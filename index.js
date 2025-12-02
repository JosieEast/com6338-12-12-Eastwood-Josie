const words = [
  'bananas',
  'grapes',
  'carousel',
  'milkshake',
  'javascript',
  'limousine',
  'chocolate',
  'programming',
  'meatloaf',
  'ukulele',
  'mango'
]

let wins = 0
let losses = 0
let currentWord

class Word {
  constructor(word) {
    this.word = word
    this.displayWord = word.replaceAll(/[\w]/g, "_")
    this.remainingGuesses = 10
    this.incorrectLetters = []
    this.correctLetters = []
  }

  // Check and apply a guessed letter
  guessLetter(letter) {
    // ignore repeat guesses
    if (
      this.correctLetters.includes(letter) ||
      this.incorrectLetters.includes(letter)
    ) {
      return
    }

    if (this.word.includes(letter)) {
      this.correctLetters.push(letter)

      // reveal the letter in all matching positions
      const chars = this.displayWord.split('')
      for (let i = 0; i < this.word.length; i++) {
        if (this.word[i] === letter) {
          chars[i] = letter
        }
      }
      this.displayWord = chars.join('')
    } else {
      this.incorrectLetters.push(letter)
      this.remainingGuesses--
    }
  }

  // Update DOM to reflect current game state
  updateScreen() {
    document.getElementById('remaining-guesses').textContent =
      this.remainingGuesses

    document.getElementById('incorrect-letters').textContent =
      this.incorrectLetters.join(', ')

    document.getElementById('word-to-guess').textContent =
      this.displayWord
  }

  // Determine if the game has ended
  isGameOver() {
    if (this.remainingGuesses <= 0) return true
    if (this.displayWord === this.word) return true
    return false
  }

  // Return win/loss/null
  getWinOrLoss() {
    const solved = this.displayWord === this.word

    if (solved && this.remainingGuesses > 0) return 'win'
    if (!solved && this.remainingGuesses <= 0) return 'loss'

    return null
  }
}

function newGame() {
  const randomWord = words[Math.floor(Math.random() * words.length)]
  currentWord = new Word(randomWord)
  currentWord.updateScreen()
}

document.onkeyup = function(e) {
  const pressedKey = e.key.toLowerCase()
  // early exit for non-letter key presses
  if (!/^[a-z]{1}$/g.test(pressedKey)) return

  // pass in guessed letter to word obj
  currentWord.guessLetter(pressedKey)
  // allow word obj to update screen
  currentWord.updateScreen()

  // check if game is over
  const gameOver = currentWord.isGameOver()

  // if game is over, update wins/losses and start new game
  if (gameOver) {
    const previousWord = document.getElementById('previous-word')
    const winDisplay = document.getElementById('wins')
    const lossDisplay = document.getElementById('losses')
    previousWord.textContent = currentWord.word
    const result = currentWord.getWinOrLoss()
    if (result === 'win') {
      wins++
      winDisplay.textContent = wins
    } else if (result === 'loss') {
      losses++
      lossDisplay.textContent = losses
    }
    newGame()
  }
}

newGame()
