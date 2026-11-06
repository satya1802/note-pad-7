/**
 * The component vocabulary generated screens are written against: the Vue twin of the
 * React kit, with the same names, the same classes and the same brand variables, so a
 * screen looks the same whichever framework draws it.
 *
 * Deliberately quiet. The personality of a prototype comes from the design direction
 * and the brand tokens the user chose, not from this file.
 *
 * Vue's own idiom where it differs from React's: `class` rather than `className`, slots
 * rather than children, and `v-model` on every control that holds a value.
 */
import { defineComponent, h, type PropType } from "vue";

function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

const BUTTON_VARIANTS: Record<string, string> = {
  primary: "text-white shadow-sm hover:opacity-90",
  secondary: "border bg-white hover:bg-slate-50",
  ghost: "hover:bg-slate-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
};

const BUTTON_SIZES: Record<string, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-6 text-base",
};

export const Button = defineComponent({
  name: "Button",
  props: {
    variant: { type: String, default: "primary" },
    size: { type: String, default: "md" },
  },
  setup(props, { slots }) {
    return () =>
      h(
        "button",
        {
          class: cx(
            "inline-flex items-center justify-center gap-2 rounded-[var(--brand-radius)] font-medium",
            "transition-colors focus-visible:outline-none focus-visible:ring-2",
            "focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2",
            "disabled:pointer-events-none disabled:opacity-50",
            BUTTON_VARIANTS[props.variant] ?? BUTTON_VARIANTS.primary,
            BUTTON_SIZES[props.size] ?? BUTTON_SIZES.md
          ),
          style:
            props.variant === "primary" ? { backgroundColor: "var(--brand-primary)" } : undefined,
        },
        slots.default?.()
      );
  },
});

/** A component that is one element with fixed classes; everything else falls through. */
function styled(name: string, tag: string, classes: string, style?: Record<string, string>) {
  return defineComponent({
    name,
    setup(_, { slots }) {
      return () => h(tag, { class: classes, style }, slots.default?.());
    },
  });
}

export const Card = styled(
  "Card",
  "div",
  "rounded-[var(--brand-radius)] border border-slate-200 bg-white shadow-sm"
);
export const CardHeader = styled("CardHeader", "div", "flex flex-col gap-1 p-5 pb-3");
export const CardTitle = styled(
  "CardTitle",
  "h3",
  "text-base font-semibold tracking-tight text-slate-900",
  { fontFamily: "var(--brand-font-heading)" }
);
export const CardDescription = styled("CardDescription", "p", "text-sm text-slate-500");
export const CardContent = styled("CardContent", "div", "p-5 pt-0");
export const CardFooter = styled(
  "CardFooter",
  "div",
  "flex items-center gap-2 border-t border-slate-100 p-5"
);

const FIELD =
  "w-full rounded-[var(--brand-radius)] border border-slate-300 bg-white px-3 py-2 text-sm " +
  "placeholder:text-slate-400 focus:border-[var(--brand-primary)] focus:outline-none " +
  "focus:ring-1 focus:ring-[var(--brand-primary)]";

function textField(name: string, tag: "input" | "textarea", size: string) {
  return defineComponent({
    name,
    props: { modelValue: { type: [String, Number], default: undefined } },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
      return () =>
        h(tag, {
          class: cx(FIELD, size),
          value: props.modelValue,
          onInput: (event: Event) =>
            emit("update:modelValue", (event.target as HTMLInputElement).value),
        });
    },
  });
}

export const Input = textField("Input", "input", "h-9");
export const Textarea = textField("Textarea", "textarea", "min-h-[80px]");
export const Label = styled("Label", "label", "text-sm font-medium text-slate-700");

export const Select = defineComponent({
  name: "Select",
  props: {
    modelValue: { type: [String, Number], default: undefined },
    options: {
      type: Array as PropType<Array<{ value: string; label: string }>>,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit, slots }) {
    return () =>
      h(
        "select",
        {
          class: cx(FIELD, "h-9"),
          value: props.modelValue,
          onChange: (event: Event) =>
            emit("update:modelValue", (event.target as HTMLSelectElement).value),
        },
        slots.default?.() ??
          props.options.map((option) =>
            h("option", { key: option.value, value: option.value }, option.label)
          )
      );
  },
});

export const Checkbox = defineComponent({
  name: "Checkbox",
  props: { modelValue: { type: Boolean, default: undefined } },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    return () =>
      h("input", {
        type: "checkbox",
        class: "h-4 w-4 rounded border-slate-300 accent-[var(--brand-primary)]",
        checked: props.modelValue,
        onChange: (event: Event) =>
          emit("update:modelValue", (event.target as HTMLInputElement).checked),
      });
  },
});

export const Switch = defineComponent({
  name: "Switch",
  props: { modelValue: { type: Boolean, default: false } },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    return () =>
      h("label", { class: "inline-flex cursor-pointer items-center" }, [
        h("input", {
          type: "checkbox",
          class: "peer sr-only",
          checked: props.modelValue,
          onChange: (event: Event) =>
            emit("update:modelValue", (event.target as HTMLInputElement).checked),
        }),
        h(
          "span",
          {
            class:
              "relative h-5 w-9 rounded-full bg-slate-300 transition-colors peer-checked:bg-[var(--brand-primary)]",
            "aria-hidden": "true",
          },
          [
            h("span", {
              class:
                "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4",
            }),
          ]
        ),
      ]);
  },
});

const BADGE_VARIANTS: Record<string, string> = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
  accent: "text-white",
};

export const Badge = defineComponent({
  name: "Badge",
  props: { variant: { type: String, default: "default" } },
  setup(props, { slots }) {
    return () =>
      h(
        "span",
        {
          class: cx(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
            BADGE_VARIANTS[props.variant] ?? BADGE_VARIANTS.default
          ),
          style:
            props.variant === "accent" ? { backgroundColor: "var(--brand-accent)" } : undefined,
        },
        slots.default?.()
      );
  },
});

export const Table = defineComponent({
  name: "Table",
  // The scroll wrapper is the root; what the screen sets belongs on the table.
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () =>
      h("div", { class: "w-full overflow-x-auto" }, [
        h("table", { ...attrs, class: cx("w-full border-collapse text-sm", attrs.class as string) }, slots.default?.()),
      ]);
  },
});
export const THead = styled("THead", "thead", "border-b border-slate-200");
export const TBody = styled("TBody", "tbody", "divide-y divide-slate-100");
export const TR = styled("TR", "tr", "transition-colors hover:bg-slate-50");
export const TH = styled(
  "TH",
  "th",
  "px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
);
export const TD = styled("TD", "td", "px-3 py-2.5 text-slate-700");

export const Avatar = defineComponent({
  name: "Avatar",
  props: { name: { type: String, default: "" }, src: { type: String, default: undefined } },
  setup(props) {
    return () => {
      const initials = props.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
      return h(
        "span",
        {
          class: cx(
            "inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full",
            "bg-slate-200 text-xs font-medium text-slate-600"
          ),
        },
        props.src
          ? [h("img", { src: props.src, alt: props.name, class: "h-full w-full object-cover" })]
          : initials
      );
    };
  },
});

export const Separator = defineComponent({
  name: "Separator",
  setup() {
    return () => h("hr", { class: "border-slate-200" });
  },
});

export const Tabs = defineComponent({
  name: "Tabs",
  props: {
    tabs: { type: Array as PropType<Array<{ key: string; label: string }>>, default: () => [] },
    modelValue: { type: String, default: undefined },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    return () =>
      h(
        "div",
        { class: "flex gap-1 border-b border-slate-200" },
        props.tabs.map((tab) =>
          h(
            "button",
            {
              key: tab.key,
              onClick: () => emit("update:modelValue", tab.key),
              class: cx(
                "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                tab.key === props.modelValue
                  ? "border-[var(--brand-primary)] text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              ),
            },
            tab.label
          )
        )
      );
  },
});

export const Stat = defineComponent({
  name: "Stat",
  props: {
    label: { type: String, required: true },
    value: { type: [String, Number], default: "" },
    hint: { type: String, default: undefined },
  },
  setup(props) {
    return () =>
      h("div", { class: "rounded-[var(--brand-radius)] border border-slate-200 bg-white p-4" }, [
        h("p", { class: "text-xs font-medium uppercase tracking-wide text-slate-500" }, props.label),
        h(
          "p",
          {
            class: "mt-1 text-2xl font-semibold text-slate-900",
            style: { fontFamily: "var(--brand-font-heading)" },
          },
          String(props.value)
        ),
        props.hint ? h("p", { class: "mt-1 text-xs text-slate-500" }, props.hint) : null,
      ]);
  },
});

export const Empty = defineComponent({
  name: "Empty",
  props: {
    title: { type: String, required: true },
    description: { type: String, default: undefined },
  },
  setup(props, { slots }) {
    return () =>
      h(
        "div",
        {
          class: cx(
            "flex flex-col items-center justify-center gap-2 rounded-[var(--brand-radius)]",
            "border border-dashed border-slate-300 px-6 py-12 text-center"
          ),
        },
        [
          h("p", { class: "text-sm font-medium text-slate-900" }, props.title),
          props.description
            ? h("p", { class: "max-w-sm text-sm text-slate-500" }, props.description)
            : null,
          slots.action?.() ?? slots.default?.(),
        ]
      );
  },
});
