import { Component, Input, computed, effect, ɵinput } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

// This is a demo of an unreleased feature and is based on a dev build.
// input() is not a public export yet, so we rely on the private ɵinput.

@Component({
  selector: 'app-child',
  standalone: true,
  template: `
    Value : {{ value() }}<br />
    Required value : {{ requiredValue() }}<br />
    Transformed value : {{ transform() }}<br />
    Old Input: {{ oldInput }}<br />
    Input alias : {{ someInput() }}<br />

    Computed: {{ times2() }}
  `,
})
export class ChildComponent {
  // Don't hesitate to have a look at the infered types, they are a bit different from standard signals.
  value = ɵinput(3);
  requiredValue = ɵinput.required<number>();
  someInput = ɵinput.required<string>({ alias: 'aliased' });
  transform = ɵinput(undefined, {
    transform: (v: string) => `transformed ${v}`,
  });
  times2 = computed(() => this.value());
  @Input() oldInput!: string;

  constructor() {
    setTimeout(() => {
      console.log(this.value());
    }, 1000);

    effect(() => {
      console.log(`value: ${this.value()} — ${this.requiredValue()}`);
    });
  }

  ngOnInit() {
    console.log(this.value, this.requiredValue, this.transform);
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ChildComponent],
  template: ` <!-- Remove the required input to throw an error -->
    <!-- Disable the Angular Language service extensions to remove the template errors, it does not support signal inputs yet). -->
    <app-child
      [value]="5"
      [requiredValue]="33"
      [transform]="'foobar'"
      [aliased]="'aliasingWorks'"
      [oldInput]="'still ok'"
    />`,
})
export class AppComponent {}

bootstrapApplication(AppComponent).catch((err) => console.error(err));
