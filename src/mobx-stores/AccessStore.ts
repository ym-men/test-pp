import { action, observable } from 'mobx';
import StoreConstructor from './StoreConstructor';
import { Entities } from '../../entities';
import TRoles = Entities.TRoles;
import TControl = Entities.TControl;
import { IStores } from './stores';
import { IDataError, silentError, handleSilentError } from 'utils/errors';

export type TControlAction = {
  text: string;
  isActionBtn?: boolean;
  validations: ((data: TControl) => Promise<void>)[];
  exec: (stores: IStores) => Promise<any>;
  needComment?: boolean;
  commentTitle?: string;
  commentText?: string;
  commentPlaceholder?: string;
};

export type TControlComponent =
  | 'inspector'
  | 'dates'
  | 'production'
  | 'files'
  | 'staff'
  | 'meetingNeeded';

export type TAccess = {
  headTitle?: string;
  role: TRoles;
  description?: string;
  actions: TControlAction[];
  visibleComponents: TControlComponent[];
  editableComponents: TControlComponent[];
  waiting?: boolean;
  allowedDocumentTypes: number[];
};

export default class AccessStore extends StoreConstructor {
  // errors
  @observable public errModalVisible: boolean = false;
  @observable public validationErr: string = '';
  // comments
  @observable public commentModalVisible: boolean = false;
  @observable public commentModalTitle: string = '';
  @observable public commentModalText: string = '';
  @observable public commentModalPlaceholder: string = '';

  private commentResolver: { resolve: () => void; reject: (msg: IDataError) => void } = null;

  @action.bound
  public showCommentModal(title: string, text: string, placeholder: string) {
    return new Promise((resolve, reject) => {
      this.commentModalVisible = true;
      this.commentModalTitle = title;
      this.commentModalPlaceholder = placeholder;
      this.commentModalText = text;
      this.commentResolver = {
        resolve,
        reject,
      };
    });
  }

  public submitComment(comment: string) {
    return this.stores.activeControl.submitComment(comment).then(() => {
      this.commentResolver.resolve();
      this.closeCommentModal();
    });
  }

  public rejectComment() {
    this.commentResolver.reject(silentError);
    this.closeCommentModal();
  }

  public execAction(act: TControlAction) {
    return Promise.all(act.validations.map(validate => validate(this.stores.activeControl.data)))
      .then(
        () =>
          act.needComment &&
          this.showCommentModal(act.commentTitle, act.commentText, act.commentPlaceholder)
      )
      .then(() => act.exec(this.stores))
      .catch(handleSilentError)
      .catch(this.showError);
  }

  @action.bound
  private showError(error: IDataError) {
    this.validationErr = error.message;
    this.errModalVisible = true;
  }

  @action.bound
  private closeCommentModal() {
    this.commentModalVisible = false;
    this.commentResolver = null;
    this.commentModalText = '';
  }
}
