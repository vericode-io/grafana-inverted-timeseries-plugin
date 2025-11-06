/**
 * Testes para utils-vertical.ts
 * Testa as funções de inversão de direção do tempo
 */

import { DataFrame, FieldType } from '@grafana/data';
import { invertTimeDirection, invertTimeDirectionInFrames, hasTimeField } from './utils-vertical';

describe('utils-vertical', () => {
  describe('invertTimeDirection', () => {
    it('deve inverter a ordem dos valores em todos os campos', () => {
      const frame: DataFrame = {
        name: 'test',
        length: 3,
        fields: [
          {
            name: 'time',
            type: FieldType.time,
            config: {},
            values: [1000, 2000, 3000],
          },
          {
            name: 'value',
            type: FieldType.number,
            config: {},
            values: [10, 20, 30],
          },
        ],
      };

      const inverted = invertTimeDirection(frame);

      expect(inverted.fields[0].values).toEqual([3000, 2000, 1000]);
      expect(inverted.fields[1].values).toEqual([30, 20, 10]);
    });

    it('deve manter o tamanho do frame', () => {
      const frame: DataFrame = {
        name: 'test',
        length: 5,
        fields: [
          {
            name: 'time',
            type: FieldType.time,
            config: {},
            values: [1, 2, 3, 4, 5],
          },
        ],
      };

      const inverted = invertTimeDirection(frame);

      expect(inverted.length).toBe(5);
    });

    it('deve preservar metadados do frame', () => {
      const frame: DataFrame = {
        name: 'test-frame',
        length: 2,
        fields: [
          {
            name: 'time',
            type: FieldType.time,
            config: {},
            values: [100, 200],
          },
        ],
        meta: {
          custom: { test: 'value' },
        },
      };

      const inverted = invertTimeDirection(frame);

      expect(inverted.name).toBe('test-frame');
      expect(inverted.meta).toEqual({ custom: { test: 'value' } });
    });

    it('deve lidar com frame vazio', () => {
      const frame: DataFrame = {
        name: 'empty',
        length: 0,
        fields: [],
      };

      const inverted = invertTimeDirection(frame);

      expect(inverted.fields).toEqual([]);
      expect(inverted.length).toBe(0);
    });

    it('deve preservar propriedades dos campos', () => {
      const frame: DataFrame = {
        name: 'test',
        length: 2,
        fields: [
          {
            name: 'temperature',
            type: FieldType.number,
            config: { unit: 'celsius' },
            values: [20, 25],
            labels: { sensor: 'A' },
          },
        ],
      };

      const inverted = invertTimeDirection(frame);

      expect(inverted.fields[0].name).toBe('temperature');
      expect(inverted.fields[0].type).toBe(FieldType.number);
      expect(inverted.fields[0].config).toEqual({ unit: 'celsius' });
      expect(inverted.fields[0].labels).toEqual({ sensor: 'A' });
    });
  });

  describe('invertTimeDirectionInFrames', () => {
    it('deve inverter múltiplos frames', () => {
      const frames: DataFrame[] = [
        {
          name: 'frame1',
          length: 2,
          fields: [
            {
              name: 'time',
              type: FieldType.time,
              config: {},
              values: [1000, 2000],
            },
          ],
        },
        {
          name: 'frame2',
          length: 2,
          fields: [
            {
              name: 'time',
              type: FieldType.time,
              config: {},
              values: [3000, 4000],
            },
          ],
        },
      ];

      const inverted = invertTimeDirectionInFrames(frames);

      expect(inverted).toHaveLength(2);
      expect(inverted[0].fields[0].values).toEqual([2000, 1000]);
      expect(inverted[1].fields[0].values).toEqual([4000, 3000]);
    });

    it('deve lidar com array vazio de frames', () => {
      const frames: DataFrame[] = [];

      const inverted = invertTimeDirectionInFrames(frames);

      expect(inverted).toEqual([]);
    });

    it('deve preservar a ordem dos frames', () => {
      const frames: DataFrame[] = [
        {
          name: 'first',
          length: 1,
          fields: [{ name: 'time', type: FieldType.time, config: {}, values: [100] }],
        },
        {
          name: 'second',
          length: 1,
          fields: [{ name: 'time', type: FieldType.time, config: {}, values: [200] }],
        },
        {
          name: 'third',
          length: 1,
          fields: [{ name: 'time', type: FieldType.time, config: {}, values: [300] }],
        },
      ];

      const inverted = invertTimeDirectionInFrames(frames);

      expect(inverted[0].name).toBe('first');
      expect(inverted[1].name).toBe('second');
      expect(inverted[2].name).toBe('third');
    });
  });

  describe('hasTimeField', () => {
    it('deve retornar true quando frame tem campo de tempo', () => {
      const frame: DataFrame = {
        name: 'test',
        length: 1,
        fields: [
          {
            name: 'time',
            type: FieldType.time,
            config: {},
            values: [1000],
          },
          {
            name: 'value',
            type: FieldType.number,
            config: {},
            values: [10],
          },
        ],
      };

      expect(hasTimeField(frame)).toBe(true);
    });

    it('deve retornar false quando frame não tem campo de tempo', () => {
      const frame: DataFrame = {
        name: 'test',
        length: 1,
        fields: [
          {
            name: 'value',
            type: FieldType.number,
            config: {},
            values: [10],
          },
          {
            name: 'label',
            type: FieldType.string,
            config: {},
            values: ['test'],
          },
        ],
      };

      expect(hasTimeField(frame)).toBe(false);
    });

    it('deve retornar false para frame vazio', () => {
      const frame: DataFrame = {
        name: 'empty',
        length: 0,
        fields: [],
      };

      expect(hasTimeField(frame)).toBe(false);
    });
  });

  describe('Testes de integração', () => {
    it('deve inverter corretamente dados de time series reais', () => {
      const frame: DataFrame = {
        name: 'cpu-usage',
        length: 5,
        fields: [
          {
            name: 'Time',
            type: FieldType.time,
            config: {},
            values: [
              1699200000000, // 2023-11-05 10:00:00
              1699200060000, // 2023-11-05 10:01:00
              1699200120000, // 2023-11-05 10:02:00
              1699200180000, // 2023-11-05 10:03:00
              1699200240000, // 2023-11-05 10:04:00
            ],
          },
          {
            name: 'CPU Usage',
            type: FieldType.number,
            config: { unit: 'percent' },
            values: [45.2, 52.1, 48.9, 61.3, 55.7],
          },
        ],
      };

      const inverted = invertTimeDirection(frame);

      // Verificar que os timestamps foram invertidos
      expect(inverted.fields[0].values[0]).toBe(1699200240000);
      expect(inverted.fields[0].values[4]).toBe(1699200000000);

      // Verificar que os valores foram invertidos
      expect(inverted.fields[1].values[0]).toBe(55.7);
      expect(inverted.fields[1].values[4]).toBe(45.2);

      // Verificar que a configuração foi preservada
      expect(inverted.fields[1].config).toEqual({ unit: 'percent' });
    });

    it('deve lidar com múltiplas séries de dados', () => {
      const frame: DataFrame = {
        name: 'multi-series',
        length: 3,
        fields: [
          {
            name: 'time',
            type: FieldType.time,
            config: {},
            values: [1000, 2000, 3000],
          },
          {
            name: 'series1',
            type: FieldType.number,
            config: {},
            values: [10, 20, 30],
          },
          {
            name: 'series2',
            type: FieldType.number,
            config: {},
            values: [100, 200, 300],
          },
          {
            name: 'series3',
            type: FieldType.number,
            config: {},
            values: [1, 2, 3],
          },
        ],
      };

      const inverted = invertTimeDirection(frame);

      expect(inverted.fields[0].values).toEqual([3000, 2000, 1000]);
      expect(inverted.fields[1].values).toEqual([30, 20, 10]);
      expect(inverted.fields[2].values).toEqual([300, 200, 100]);
      expect(inverted.fields[3].values).toEqual([3, 2, 1]);
    });
  });
});
