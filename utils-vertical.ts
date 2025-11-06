/**
 * Utilities for vertical time axis and time direction inversion
 */

import { DataFrame, Field, FieldType } from '@grafana/data';

/**
 * Inverte a direção do tempo em um DataFrame
 * Reverte a ordem dos valores em todos os campos
 * @param frame DataFrame original
 * @returns DataFrame com ordem invertida
 */
export function invertTimeDirection(frame: DataFrame): DataFrame {
  const invertedFields = frame.fields.map((field) => {
    // Inverter a ordem dos valores em todos os campos
    const reversedValues = [...field.values].reverse();
    
    return {
      ...field,
      values: reversedValues,
    };
  });

  return {
    ...frame,
    fields: invertedFields,
    length: frame.length,
  };
}

/**
 * Inverte a direção do tempo em múltiplos DataFrames
 * @param frames Array de DataFrames
 * @returns Array de DataFrames com ordem invertida
 */
export function invertTimeDirectionInFrames(frames: DataFrame[]): DataFrame[] {
  return frames.map((frame) => invertTimeDirection(frame));
}

/**
 * Verifica se um DataFrame tem campo de tempo
 * @param frame DataFrame para verificar
 * @returns true se tem campo de tempo
 */
export function hasTimeField(frame: DataFrame): boolean {
  return frame.fields.some((field) => field.type === FieldType.time);
}
