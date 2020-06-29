import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { prop, uniqBy } from 'ramda';
import { IStores } from 'mobx-stores/stores';
import * as React from 'react';
import { file } from 'services/files';
import { Entities } from '../../../../../../../entities';
import TDocument = Entities.TDocument;
import { Box } from 'grommet';
import { Button, Text, If, CloseIcon } from 'components/ui';
import IFileData = file.IFileData;
import { TWithout } from '../../../../../../interface';
import * as styles from './styles.styl';

interface IProps {
  onChange: (doc: TDocument | null) => {};
}

@inject('user')
@observer
export class AddFileBlock extends React.Component<IStores & IProps> {
  @observable
  private docs: TDocument[] = [];

  public render() {
    return (
      <Box
        direction={'row'}
        alignSelf={'start'}
        margin={{ vertical: 'medium' }}
        align={'center'}
        width="100%"
      >
        <If condition={!this.docs.length}>
          <Button
            id="control-addFileBlock-file-overview"
            onChange={(list: IFileData[]) => this.onChangeFiles(list)}
            accept={'image/*,application/pdf'}
            small={true}
            btnType={'file'}
          >
            Обзор
          </Button>
          <Text margin={{ horizontal: 'medium' }} size={'small'} color={'Basic600'}>
            Добавьте файл в одном из следующих форматов:
            <br />
            PDF, JPG, PNG, GIF, TIF
          </Text>
        </If>
        <If condition={!!this.docs.length}>
          <Box width="100%">
            {this.docs.map(doc => (
              <Box
                direction="row"
                justify="between"
                align="center"
                key={doc.id}
                className={styles.fileItem}
              >
                <Text>{doc.name}</Text>
                <CloseIcon onClick={() => this.onRemoveDocument(doc.id)} />
              </Box>
            ))}
          </Box>
        </If>
      </Box>
    );
  }

  private onRemoveDocument(id: string) {
    this.docs = this.docs.filter(doc => doc.id !== id);

    this.props.onChange(null);
  }

  private onChangeFiles = (list: IFileData[]) => {
    const docs = list.map(f => this.fileToDoc(f)).concat(this.docs as any);

    this.docs = uniqBy(prop('id'), docs as any);

    this.props.onChange(this.docs[0]);
  };

  private fileToDoc(item: file.IFileData): TWithout<TDocument, 'type'> & { type: string | null } {
    const user = this.props.user;

    const doc: any = {
      date: item.date,
      id: item.id,
      name: item.name,
      size: item.size,
      author: user.userInfo.displayName,
      type: 12,
      status: 'approving',
    };

    return doc;
  }
}
