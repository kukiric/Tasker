import { noop, debounce, Cancelable } from "lodash";
import Vue from "vue";

export default Vue.extend({
    data() {
        return {
            emitUpdate: noop,
            editing: false,
            content: ""
        } as {
            emitUpdate: ((s: string) => void) & Cancelable,
            editing: boolean,
            content: string
        };
    },
    props: {
        debounce: { type: Number, default: 1000 },
        textarea: { type: Boolean, default: false },
        spellcheck: { type: Boolean, default: true},
        type: { type: String, default: "text" },
        tag: { type: String, default: "div" },
        rows: { type: Number, default: 20 },
        placeholder: { type: String },
        display: Function,
        value: String
    },
    computed: {
        contentIsEmpty(): boolean {
            return this.placeholder != null && this.content.trim() === "";
        },
        divContent(): string {
            return this.contentIsEmpty ? this.placeholder : this.content;
        },
        divStyle(): string {
            return this.contentIsEmpty ? "color: #bbb" : "";
        }
    },
    methods: {
        emitUpdateImpl(content: string) {
            this.$emit("input", content);
        },
        beginEditing() {
            this.editing = true;
            this.$nextTick(() => {
                let input = this.$refs.input;
                if (input instanceof HTMLElement) {
                    input.focus();
                }
            });
        },
        stopEditing() {
            this.editing = false;
            this.emitUpdate.flush();
        }
    },
    created() {
        this.content = this.value;
        this.emitUpdate = debounce(this.emitUpdateImpl, this.debounce);
        if (this.type === "date") {
            //
        }
    }
});
