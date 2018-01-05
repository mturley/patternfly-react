import 'patternfly/dist/js/patternfly-settings';
import 'patternfly/dist/js/patternfly-settings-charts';
import Break from 'breakjs';

const patternfly = window.patternfly;
const layout = Break({ mobile: 0, ...patternfly.pfBreakpoints });
const c3ChartDefaults = patternfly.c3ChartDefaults();

export { patternfly, layout, c3ChartDefaults };
