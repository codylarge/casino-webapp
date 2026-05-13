function cardValue(card, aceAs11 = false) {
    const val = card.split('_')[0]
    if (val === 'jack' || val === 'queen' || val === 'king') return 10
    if (val === 'ace') return aceAs11 ? 11 : 1
    if (val === 'cover') return 0
    return parseInt(val, 10)
}

// Returns 'hit', 'stand', or 'double'
export function getStrategy(playerCards, dealerVisibleCard) {
    const dealer = cardValue(dealerVisibleCard, true)

    let hardTotal = 0
    let hasAce = false
    for (const card of playerCards) {
        if (card.split('_')[0] === 'ace') { hardTotal += 1; hasAce = true }
        else hardTotal += cardValue(card)
    }

    const isSoft = hasAce && hardTotal + 10 <= 21
    const total = isSoft ? hardTotal + 10 : hardTotal

    return isSoft ? softStrategy(total, dealer) : hardStrategy(total, dealer)
}

function hardStrategy(total, dealer) {
    if (total >= 17) return 'stand'
    if (total >= 13) return dealer <= 6 ? 'stand' : 'hit'
    if (total === 12) return (dealer >= 4 && dealer <= 6) ? 'stand' : 'hit'
    if (total === 11) return dealer <= 10 ? 'double' : 'hit'
    if (total === 10) return dealer <= 9 ? 'double' : 'hit'
    if (total === 9) return (dealer >= 3 && dealer <= 6) ? 'double' : 'hit'
    return 'hit'
}

function softStrategy(total, dealer) {
    if (total >= 19) return 'stand'
    if (total === 18) {
        if (dealer >= 3 && dealer <= 6) return 'double'
        if (dealer === 2 || dealer === 7 || dealer === 8) return 'stand'
        return 'hit'
    }
    if (total === 17) return (dealer >= 3 && dealer <= 6) ? 'double' : 'hit'
    if (total === 16 || total === 15) return (dealer >= 4 && dealer <= 6) ? 'double' : 'hit'
    if (total === 14 || total === 13) return (dealer >= 5 && dealer <= 6) ? 'double' : 'hit'
    return 'hit'
}
