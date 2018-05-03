import { noop, debounce, Cancelable } from "lodash";
import Vue, { PropOptions } from "vue";
import * as moment from "moment";

export default Vue.extend({
    data() {
        return {
            debouncedUpdate: noop,
            canUnfocus: false,
            editing: false,
            content: "",
            saved: ""
        }
    },
    props: {
        debounce: { type: Number, default: 1000 },
        textarea: { type: Boolean, default: false },
        select : { type: Boolean, default: false },
        spellcheck: { type: Boolean, default: true},
        type: { type: String, default: "text" },
        tag: { type: String, default: "div" },
        rows: { type: Number, default: 20 },
        value: { type: [ String, Number ] },
        placeholder: { type: String },
        options: { type: Array } as PropOptions<any[]>, // Bug: https://github.com/Microsoft/TypeScript/issues/22471
        min: { type: Number },
        max: { type: Number },
        display: Function
    },
    computed: {
        contentIsEmpty() {
            return this.placeholder != null && this.content.trim() === "";
        },
        divContent() {
            return this.contentIsEmpty ? this.placeholder : this.content;
        },
        divStyle() {
            return this.contentIsEmpty ? "color: #bbb" : "";
        }
    },
    methods: {
        refocus() {
            let input = this.$refs.input;
            if (input instanceof HTMLElement) {
                input.focus();
            }
        },
        emitUpdateImpl(content: string) {
            if (this.saved !== this.content) {
                this.saved = this.content;
                this.$emit("input", content);
            }
        },
        emitUpdate(content: string) {
            this.$emit("inputImmediate", content);
            this.debouncedUpdate(content);
        },
        beginEditing() {
            this.editing = true;
            this.canUnfocus = false;
            this.$nextTick(() => {
                this.refocus();
                this.canUnfocus = true;
            });
        },
        stopEditing() {
            if (this.canUnfocus) {
                this.editing = false;
                this.debouncedUpdate.flush();
            }
            else {
                this.refocus();
            }
        }
    },
    created() {
        this.content = this.saved = this.value;
        this.debouncedUpdate = debounce(this.emitUpdateImpl, this.debounce);
        if (this.type === "date") {
            let date = moment(this.value).format("YYYY-MM-DD");
            this.content = this.saved = date;
        }
    }
});
