Feature: Button hover and pressed states provide subtle motion and depth

  Background:
    Given the Pomodoro Timer app is open

  Scenario: Control buttons are visible and focusable
    Then I should see the Start button
    And I should see the Pause button
    And I should see the Reset button
    When I move focus to the Start button using keyboard navigation
    Then the Start button should display a visible focus indicator

  Scenario: Enabled control buttons show a pressed state while mouse is down
    When I press and hold the Start button
    Then the Start button should visually appear pressed
    When I release the Start button
    Then the Start button should return to its default visual state

  Scenario: Disabled buttons do not show hover or pressed styling
    When I start the timer
    Then the Start button should be disabled
    When I hover the Start button
    Then the Start button should not visually change due to hover styling
    When I press and hold the Start button
    Then the Start button should not visually appear pressed

  Scenario: Notifications button shows pressed state when enabled
    Then I should see the Enable notifications button
    When I press and hold the Enable notifications button
    Then the Enable notifications button should visually appear pressed
    When I release the Enable notifications button
    Then the Enable notifications button should return to its default visual state
