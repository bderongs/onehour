// Purpose: Shared component for form field validation with animation and scrolling functionality
// This component provides utilities for highlighting and scrolling to invalid form fields using Tailwind animations

import { useEffect } from 'react';

/**
 * No longer needed as we're using Tailwind animations
 * Kept as a no-op for backward compatibility
 */
export function useValidationStyles() {
  // No-op function for backward compatibility
  // We're now using Tailwind animations instead of custom CSS
}

/**
 * Scrolls to an element and highlights it with a Tailwind animation
 * @param elementId - The ID of the element to scroll to and highlight
 * @param options - Optional configuration options
 */
export function scrollAndHighlightElement(
  elementId: string, 
  options: {
    behavior?: ScrollBehavior,
    block?: ScrollLogicalPosition,
    highlightDuration?: number
  } = {}
) {
  const { 
    behavior = 'smooth', 
    block = 'center',
    highlightDuration = 2000 
  } = options;

  const element = document.getElementById(elementId);
  if (element) {
    // Scroll to the element with the specified options
    element.scrollIntoView({ behavior, block });
    
    // Add Tailwind animation classes
    element.classList.add('animate-highlight-error', 'border-red-500');
    
    // Remove animation classes after animation completes
    setTimeout(() => {
      element.classList.remove('animate-highlight-error', 'border-red-500');
    }, highlightDuration);
  }
}

/**
 * Validates form fields and scrolls to the first invalid field
 * @param validationResults - Array of validation results with field IDs
 * @param showErrorMessage - Function to display error message
 * @returns Whether all fields are valid
 */
export function validateAndScrollToFirstError<T>(
  validationResults: Array<{
    isValid: boolean;
    fieldId?: string;
    data: T;
  }>,
  showErrorMessage: (message: string) => void,
  errorMessage: string = 'Please fill in all required fields'
): boolean {
  // Find the first invalid field
  const firstInvalidField = validationResults.find(result => !result.isValid);
  
  if (firstInvalidField) {
    // Show error notification
    showErrorMessage(errorMessage);
    
    // Scroll to and highlight the invalid field
    if (firstInvalidField.fieldId) {
      setTimeout(() => scrollAndHighlightElement(firstInvalidField.fieldId!), 100);
    }
    
    return false;
  }
  
  return true;
} 