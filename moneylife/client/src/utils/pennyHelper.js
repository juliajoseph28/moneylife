// src/utils/pennyHelper.js

export const detectSituation = (gameState) => {
  const { balance, goal, health, totalSaved, totalSpent, savingChoices, spendingChoices, week } = gameState
  
  // Priority order of situations to check
  
  // 1. In debt (negative balance)
  if (balance < 0) {
    return {
      situation: 'debt',
      shouldShow: true,
      priority: 1
    }
  }
  
  // 2. Very low balance (less than 20% of weekly income)
  if (balance < gameState.weeklyIncome * 0.2 && balance >= 0) {
    return {
      situation: 'low_balance',
      shouldShow: true,
      priority: 2
    }
  }
  
  // 3. Low happiness (below 25)
  if (health < 25) {
    return {
      situation: 'low_happiness',
      shouldShow: true,
      priority: 3
    }
  }
  
  // 4. Spending spree (spent more than 3x what they saved)
  if (totalSpent > totalSaved * 3 && spendingChoices > 3) {
    return {
      situation: 'spending_spree',
      shouldShow: true,
      priority: 4
    }
  }
  
  // 5. Generally struggling (multiple small issues)
  const issues = []
  if (balance < goal * 0.1 && week > 3) issues.push('low_progress')
  if (spendingChoices > savingChoices && week > 2) issues.push('more_spending')
  if (health < 40) issues.push('low_happiness')
  
  if (issues.length >= 2) {
    return {
      situation: 'struggling',
      shouldShow: true,
      priority: 5
    }
  }
  
  // 6. Doing great! (positive reinforcement)
  if (balance >= goal * 0.5 && health >= 60 && savingChoices >= spendingChoices) {
    return {
      situation: 'great_job',
      shouldShow: Math.random() < 0.3, // 30% chance to show encouragement
      priority: 10
    }
  }
  
  return {
    situation: null,
    shouldShow: false,
    priority: 0
  }
}

// When to trigger the help check
export const shouldCheckForHelp = (gameState, lastHelpWeek) => {
  // Don't show help too frequently
  if (gameState.week - lastHelpWeek < 2) return false
  
  // Always check on certain weeks
  if (gameState.week % 3 === 0) return true
  
  // Check if in a bad situation
  if (gameState.balance < 0) return true
  if (gameState.health < 20) return true
  
  return false
}