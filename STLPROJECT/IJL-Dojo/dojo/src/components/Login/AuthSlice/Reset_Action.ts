import { Action } from '@reduxjs/toolkit';

// Define a reset action type
export const RESET_STATE = 'RESET_STATE';

// Action creator for resetting the state
export const resetState = (): Action => ({
  type: RESET_STATE,
});
