import { type Reactive, reactive, toRaw } from 'vue';
import { storage, uid } from '@vtj/utils';
import { STATE_KEY } from '../constants';

export interface LLM {
  id?: string;
  label: string;
  baseURL: string;
  model: string;
  apiKey: string;
}

export interface EngineState {
  /**
   * 设计视图是否显示辅助线
   */
  outlineEnabled: boolean;

  /**
   * 设计视图是否响应事件
   */
  activeEvent: boolean;

  /**
   * AI自动应用
   */
  autoApply: boolean;

  /**
   * 当前使用的 AI 大模型
   */
  llm: string | LLM;

  /**
   * 自定义模型列表
   */
  LLMs: LLM[];
}

export class State {
  private __state: Reactive<EngineState> = reactive({
    outlineEnabled: true,
    activeEvent: true,
    autoApply: true,
    llm: '',
    LLMs: []
  });

  constructor() {
    const state = storage.get(STATE_KEY, { type: 'local' });
    if (state) {
      Object.assign(this.__state, state);
    }
  }

  private save(key: keyof EngineState, value: any) {
    //@ts-ignore
    this.__state[key] = value;
    storage.save(STATE_KEY, toRaw(this.__state), { type: 'local' });
  }

  get outlineEnabled() {
    return this.__state.outlineEnabled;
  }

  set outlineEnabled(value: any) {
    this.save('outlineEnabled', value);
  }

  get activeEvent() {
    return this.__state.activeEvent;
  }

  set activeEvent(value: any) {
    this.save('activeEvent', value);
  }

  get autoApply() {
    return this.__state.autoApply;
  }

  set autoApply(value: any) {
    this.save('autoApply', value);
  }

  get llm() {
    return this.__state.llm;
  }

  set llm(value: any) {
    this.save('llm', value);
  }

  get LLMs() {
    return this.__state.LLMs;
  }
  set LLMs(value: LLM[]) {
    this.save('LLMs', value);
  }

  saveLLM(item: LLM) {
    item.id = item.id || uid();
    const index = this.__state.LLMs.findIndex((n) => n.id === item.id);
    if (index > -1) {
      this.__state.LLMs.splice(index, 1, item);
    } else {
      this.__state.LLMs.push(item);
    }
    this.LLMs = this.__state.LLMs;
  }

  removeLLM(item: LLM) {
    const index = this.__state.LLMs.findIndex((n) => n.id === item.id);
    if (index > -1) {
      this.__state.LLMs.splice(index, 1);
      this.LLMs = this.__state.LLMs;
    }
  }

  getLLMById(id: string) {
    return this.__state.LLMs.find((n) => n.id === id);
  }
}
