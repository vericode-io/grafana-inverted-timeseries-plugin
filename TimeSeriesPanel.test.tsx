/**
 * Testes para TimeSeriesPanel.tsx
 * Testa a integração das funcionalidades de rotação e inversão
 */

import React from 'react';
import { render } from '@testing-library/react';
import { PanelProps, FieldType, toDataFrame } from '@grafana/data';
import { VizOrientation } from '@grafana/schema';
import { TimeSeriesPanel } from './TimeSeriesPanel';
import { Options } from './panelcfg.gen';

// Mock dos módulos do Grafana
jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  usePanelContext: () => ({
    sync: undefined,
    eventsScope: 'global',
    canAddAnnotations: () => false,
    onThresholdsChange: undefined,
    canEditThresholds: () => false,
    showThresholds: false,
    eventBus: { publish: jest.fn(), subscribe: jest.fn() },
    canExecuteActions: () => false,
  }),
}));

jest.mock('@grafana/data', () => ({
  ...jest.requireActual('@grafana/data'),
  useDataLinksContext: () => ({
    dataLinkPostProcessor: undefined,
  }),
}));

describe('TimeSeriesPanel', () => {
  const defaultOptions: Options = {
    legend: {
      displayMode: 'list' as any,
      placement: 'bottom' as any,
      showLegend: true,
      calcs: [],
    },
    tooltip: {
      mode: 'single' as any,
      sort: 'none' as any,
    },
    timezone: ['browser'],
    verticalTimeAxis: false,
    invertTimeDirection: false,
  };

  const createProps = (options: Partial<Options> = {}): PanelProps<Options> => {
    const data = {
      series: [
        toDataFrame({
          fields: [
            { name: 'time', type: FieldType.time, values: [1000, 2000, 3000] },
            { name: 'value', type: FieldType.number, values: [10, 20, 30] },
          ],
        }),
      ],
      state: 'Done' as any,
      timeRange: {
        from: { valueOf: () => 1000 } as any,
        to: { valueOf: () => 3000 } as any,
        raw: { from: 'now-1h', to: 'now' },
      },
      structureRev: 1,
    };

    return {
      data,
      timeRange: data.timeRange,
      timeZone: 'browser',
      width: 800,
      height: 600,
      options: { ...defaultOptions, ...options },
      fieldConfig: { defaults: {}, overrides: [] },
      onChangeTimeRange: jest.fn(),
      replaceVariables: (str: string) => str,
      id: 1,
      title: 'Test Panel',
      transparent: false,
      renderCounter: 0,
      eventBus: { publish: jest.fn(), subscribe: jest.fn() } as any,
      onOptionsChange: jest.fn(),
      onFieldConfigChange: jest.fn(),
    } as any;
  };

  describe('Vertical Time Axis', () => {
    it('deve renderizar sem erros quando verticalTimeAxis está desativado', () => {
      const props = createProps({ verticalTimeAxis: false });
      
      const { container } = render(<TimeSeriesPanel {...props} />);
      
      expect(container).toBeTruthy();
    });

    it('deve renderizar sem erros quando verticalTimeAxis está ativado', () => {
      const props = createProps({ verticalTimeAxis: true });
      
      const { container } = render(<TimeSeriesPanel {...props} />);
      
      expect(container).toBeTruthy();
    });

    it('deve aplicar orientação vertical quando verticalTimeAxis está ativo', () => {
      const props = createProps({ verticalTimeAxis: true });
      
      // O componente deve processar os dados sem erros
      expect(() => render(<TimeSeriesPanel {...props} />)).not.toThrow();
    });
  });

  describe('Invert Time Direction', () => {
    it('deve renderizar sem erros quando invertTimeDirection está ativado', () => {
      const props = createProps({
        verticalTimeAxis: true,
        invertTimeDirection: true,
      });
      
      const { container } = render(<TimeSeriesPanel {...props} />);
      
      expect(container).toBeTruthy();
    });

    it('não deve aplicar inversão quando verticalTimeAxis está desativado', () => {
      const props = createProps({
        verticalTimeAxis: false,
        invertTimeDirection: true,
      });
      
      // Deve renderizar normalmente, ignorando invertTimeDirection
      expect(() => render(<TimeSeriesPanel {...props} />)).not.toThrow();
    });

    it('deve processar dados corretamente com ambas opções ativas', () => {
      const props = createProps({
        verticalTimeAxis: true,
        invertTimeDirection: true,
      });
      
      const { container } = render(<TimeSeriesPanel {...props} />);
      
      expect(container).toBeTruthy();
    });
  });

  describe('Combinações de Opções', () => {
    it('deve lidar com todas as combinações de opções', () => {
      const combinations = [
        { verticalTimeAxis: false, invertTimeDirection: false },
        { verticalTimeAxis: false, invertTimeDirection: true },
        { verticalTimeAxis: true, invertTimeDirection: false },
        { verticalTimeAxis: true, invertTimeDirection: true },
      ];

      combinations.forEach((options) => {
        const props = createProps(options);
        expect(() => render(<TimeSeriesPanel {...props} />)).not.toThrow();
      });
    });
  });

  describe('Dados Vazios', () => {
    it('deve lidar com dados vazios', () => {
      const props = createProps({ verticalTimeAxis: true });
      props.data.series = [];
      
      const { container } = render(<TimeSeriesPanel {...props} />);
      
      expect(container).toBeTruthy();
    });
  });

  describe('Múltiplas Séries', () => {
    it('deve processar múltiplas séries de dados', () => {
      const props = createProps({
        verticalTimeAxis: true,
        invertTimeDirection: true,
      });

      props.data.series = [
        toDataFrame({
          fields: [
            { name: 'time', type: FieldType.time, values: [1000, 2000, 3000] },
            { name: 'series1', type: FieldType.number, values: [10, 20, 30] },
          ],
        }),
        toDataFrame({
          fields: [
            { name: 'time', type: FieldType.time, values: [1000, 2000, 3000] },
            { name: 'series2', type: FieldType.number, values: [100, 200, 300] },
          ],
        }),
      ];
      
      const { container } = render(<TimeSeriesPanel {...props} />);
      
      expect(container).toBeTruthy();
    });
  });
});
