import { readJSON, outputFile } from 'fs-extra';
import { RequestError, guid } from '../utils';

export class Storage<T extends Record<string, any>> {
  private readonly path: string;
  private readonly promise: Promise<T>;
  private data: T | null;

  constructor(path: string) {
    this.path = path;
    this.promise = this.read()
      .catch(() => Object.create(null))
      .then(data => {
        this.data = Object.assign(Object.create(null), data);
        return data;
      });
  }

  public getAll(): Promise<T> {
    if (this.data) {
      return Promise.resolve({ ...this.data });
    } else {
      return this.promise.then(data => ({ ...data }));
    }
  }

  public get<K extends keyof T>(key: K): Promise<T[K]> {
    const get = (data: T) => {
      if (key in data) {
        return Promise.resolve(data[key]);
      } else {
        return Promise.reject(new RequestError(404));
      }
    };
    if (this.data) {
      return get(this.data);
    } else {
      return this.promise.then(get);
    }
  }

  public set<K extends keyof T>(
    value: T[K],
    pendingResolve: Record<string, any> = {}
  ): Promise<T[K]> {
    if (this.data) {
      if (!value.id) {
        value.id = guid();
      }
      const key = value.id;

      value.pending = true;
      value.modified = new Date();
      this.data[key] = value;

      setTimeout(() => {
        if (this.data) {
          this.data[key] = { ...value, ...pendingResolve, pending: false, modified: new Date() };
        }
        // TODO: send pending notification
      }, 2e3);

      return this.write().then(() => value);
    }

    return this.promise.then(() => this.set(value, pendingResolve));
  }

  private read(): Promise<T> {
    return readJSON(this.path);
  }

  private write(): Promise<void> {
    return outputFile(this.path, JSON.stringify(this.data, null, 2));
  }
}
