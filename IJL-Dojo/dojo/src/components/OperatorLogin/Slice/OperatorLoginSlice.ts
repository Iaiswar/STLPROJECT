// OperatorLoginSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OperatorLoginState {
  operatorName: string | null;
  sessionId: string | null;
  employeeCode: string | null;
}

const initialState: OperatorLoginState = {
  operatorName: null,
  sessionId: null,
  employeeCode: null,
};

const operatorLoginSlice = createSlice({
  name: 'operatorLoginData',
  initialState,
  reducers: {
    setOperatorData: (
      state,
      action: PayloadAction<{
        operatorName: string;
        sessionId: string;
        employeeCode: string;
      }>
    ) => {
      state.operatorName = action.payload.operatorName;
      state.sessionId = action.payload.sessionId;
      state.employeeCode = action.payload.employeeCode;
    },
    clearOperatorData: (state) => {
      state.operatorName = null;
      state.sessionId = null;
      state.employeeCode = null;
    },
  },
});

export const { setOperatorData, clearOperatorData } = operatorLoginSlice.actions;
export default operatorLoginSlice.reducer;
