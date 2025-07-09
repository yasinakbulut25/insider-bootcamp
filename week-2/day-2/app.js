// Belirli bir sayı için Collatz dizisinin uzunluğunu hesaplama
function getCollatzSequenceLength(n) {
  let steps = 1;

  while (n !== 1) {
    if (n % 2 === 0) {
      n = n / 2;
    } else {
      n = 3 * n + 1;
    }

    steps++;
  }

  return steps;
}

// Verilen limitin altında en uzun Collatz dizisini üreten sayıyı bulma
function findLongestCollatzSequence(limit) {
  let maxLength = 0;
  let startingNumber = 0;

  for (let i = 1; i < limit; i++) {
    const currentLength = getCollatzSequenceLength(i);

    if (currentLength > maxLength) {
      maxLength = currentLength;
      startingNumber = i;
    }
  }

  console.log(`En uzun diziyi üreten başlangıç ​​sayısı: ${startingNumber}`);
  console.log(`Dizinin uzunluğu: ${maxLength}`);
}

findLongestCollatzSequence(1000000);

/** Console Çıktısı
 * [Log] En uzun diziyi üreten başlangıç sayısı: 837799
 * [Log] Dizinin uzunluğu: 525
 */
