import { PanelPlugin } from '@grafana/data';
import { t } from '@grafana/i18n';
import { commonOptionsBuilder } from '@grafana/ui';
import { optsWithHideZeros } from '@grafana/ui/internal';

import { TimeSeriesPanel } from './TimeSeriesPanel';
import { TimezonesEditor } from './TimezonesEditor';
import { defaultGraphConfig, getGraphFieldConfig } from './config';
import { graphPanelChangedHandler } from './migrations';
import { FieldConfig, Options } from './panelcfg.gen';
import { TimeSeriesSuggestionsSupplier } from './suggestions';

export const plugin = new PanelPlugin<Options, FieldConfig>(TimeSeriesPanel)
  .setPanelChangeHandler(graphPanelChangedHandler)
  .useFieldConfig(getGraphFieldConfig(defaultGraphConfig))
  .setPanelOptions((builder) => {
    commonOptionsBuilder.addTooltipOptions(builder, false, true, optsWithHideZeros);
    commonOptionsBuilder.addLegendOptions(builder);

    builder.addCustomEditor({
      id: 'timezone',
      name: t('timeseries.name-time-zone', 'Time zone'),
      path: 'timezone',
      category: [t('timeseries.category-axis', 'Axis')],
      editor: TimezonesEditor,
      defaultValue: undefined,
    });

    // Add vertical time axis option
    builder.addBooleanSwitch({
      path: 'verticalTimeAxis',
      name: t('timeseries.vertical-time-axis', 'Vertical time axis'),
      description: t('timeseries.vertical-time-axis-desc', 'Rotate time axis to vertical (time on Y axis, values on X axis)'),
      category: [t('timeseries.category-axis', 'Axis')],
      defaultValue: false,
    });

    // Add time direction inversion option (only visible when vertical)
    builder.addBooleanSwitch({
      path: 'invertTimeDirection',
      name: t('timeseries.invert-time-direction', 'Invert time direction'),
      description: t('timeseries.invert-time-direction-desc', 'When vertical: invert time direction (bottom to top instead of top to bottom)'),
      category: [t('timeseries.category-axis', 'Axis')],
      defaultValue: false,
      showIf: (options) => options.verticalTimeAxis === true,
    });
  })
  .setSuggestionsSupplier(new TimeSeriesSuggestionsSupplier())
  .setDataSupport({ annotations: true, alertStates: true });
