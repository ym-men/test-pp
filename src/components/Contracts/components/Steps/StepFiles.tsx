import * as React from 'react';
import { Box, Text } from 'grommet';
import { If, Button } from 'components/ui';
import TDocument = Entities.TDocument;
import { map, pipe, uniqBy, concat, prop } from 'ramda';
import { file } from 'services/files';
import IFileData = file.IFileData;
import { TWithout } from '../../../../interface';
import { Entities } from '../../../../../entities';
import { DropFileWithList } from 'components/ui';

export class StepFiles extends React.PureComponent<IFilesProps> {
  private static fileToDoc(
    item: file.IFileData
  ): TWithout<TDocument, 'type'> & { type: string | null } {
    return {
      date: item.date,
      id: item.id,
      name: item.name,
      size: item.size,
      type: null,
    } as any;
  }

  public state = {
    showListError: false,
  };

  public render() {
    const { step, stepName } = this.props.options || ({} as IFileSteps);
    const { noSteps } = this.props;

    return (
      <If condition={noSteps || stepName === step}>
        <DropFileWithList
          namespace={this.props.documentType}
          documents={this.props.documents || []}
          onRemoveDocument={this.props.onRemoveDocument}
          onChangeType={this.onChangeType}
          title={this.props.title}
          onChangeFiles={this.onChangeFiles}
          head={this.props.head || 'Загрузка документов'}
          allowedDocumentTypes={this.props.allowedDocumentTypes}
        />

        <Box margin={{ top: 'medium' }} alignSelf={'start'} direction="row">
          <If condition={!noSteps}>
            <Button
              id="contract-StepFiles-button-continue"
              onClick={this.onNextHandler}
              action={true}
            >
              Продолжить
            </Button>
          </If>
          {this.state.showListError && (
            <Box margin={{ left: 'medium' }} justify={'center'}>
              <Text color="Red600">{'Добавьте документы и укажите их типы'}</Text>
            </Box>
          )}
        </Box>
      </If>
    );
  }

  public validate(): boolean {
    const props = this.props as IFilesProps;
    const { filesRequired } = props;
    const hasDocuments = !!props.documents.length;
    const hasNoStatus = !!props.documents.filter(document => document.type == null).length;
    let result = false;
    if (filesRequired) {
      result = hasDocuments && !hasNoStatus;
    } else {
      result = !hasDocuments || !hasNoStatus;
    }
    this.setState({ showListError: !result });
    return result;
  }

  private onChangeType = (data: TDocument) => {
    this.props.onChange(
      this.props.documents.map(document => (document.id === data.id ? data : document))
    );
  };

  private onChangeFiles = (list: Array<IFileData>) => {
    const documents: Array<TDocument> = pipe(
      () => map(StepFiles.fileToDoc, list),
      concat(this.props.documents || []) as any,
      uniqBy(prop('id'))
    )() as any;
    this.setState({ showListError: false });
    this.props.onChange(documents);
  };

  private onNextHandler = () => {
    const props = this.props;

    if (!this.props.documents.length) {
      this.props.onChange([]);
    }

    if (this.validate() && props.options && !props.noSteps) {
      props.options.onNext(props.options.nextStep);
    }
  };
}

interface IFilesProps {
  title: string | React.ReactNode;
  documentType: 'contract' | 'order' | 'control' | 'delivery';
  documents: Array<TDocument>;
  onRemoveDocument: (id: string) => void;
  onChange: (documents: Array<TDocument>) => void;
  options?: IFileSteps;
  noSteps?: boolean;
  noEdit?: boolean;
  head?: string | React.ReactNode;
  allowedDocumentTypes?: number[];
  filesRequired?: boolean;
}

interface IFileSteps {
  onNext: (step: number | string) => void;
  step: number;
  stepName: number | string;
  nextStep: number | string;
}
