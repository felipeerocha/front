// cotasSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Thunk para concluir reserva
export const concluirReservaAsync = createAsyncThunk(
  'cotas/concluirReservaAsync',
  async (reservaData, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://localhost:7008/api/Cadastro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          CotaId: reservaData.cotaId,
          NumeroCota: reservaData.numeroCota,
          NomeUsuario: reservaData.nomeUsuario,
          Contato: reservaData.contato,
          Parcelamento: reservaData.parcelamento,
          DataCadastro: new Date().toISOString(),
        }),
      });
      if (!response.ok) throw new Error(`Erro ${response.status}: ${response.statusText}`);
      return response.json();
    } catch (error) {
      return rejectWithValue('Não foi possível concluir a reserva. Tente novamente.');
    }
  }
);

const cotasSlice = createSlice({
  name: 'cotas',
  initialState: {
    cotaAtual: {
      id: null,
      numeroCota: 'Desconhecido',
      tipo: 'Desconhecido',
      valor: 0,
    },
    reservaConcluida: false,
    errorMessage: '',
  },
  reducers: {
    setCotaAtual: (state, action) => {
      state.cotaAtual = action.payload;
    },
    resetReserva: (state) => {
      state.reservaConcluida = false;
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(concluirReservaAsync.fulfilled, (state) => {
        state.reservaConcluida = true;
        state.errorMessage = '';
      })
      .addCase(concluirReservaAsync.rejected, (state, action) => {
        state.errorMessage = action.payload;
      });
  },
});

export const { setCotaAtual, resetReserva } = cotasSlice.actions;
export default cotasSlice.reducer;
