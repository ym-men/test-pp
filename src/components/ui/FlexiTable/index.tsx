import * as React from 'react';
import * as styles from './FlexiTable.styl';
import * as cn from 'classnames';
import { Ord, pipe, sortBy, prop, path, isNil } from 'ramda';
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  Text,
  Box,
  TableProps,
  TableHeaderProps,
  TableBodyProps,
  TableRowProps,
  TableCellProps,
} from 'grommet';
import { toOrd } from 'utils';

import { UpIcon, DownIcon } from 'components/ui';

const getContent = pipe(
  result,
  toReactNode
);

export class FlexiTable<T> extends React.PureComponent<IProps<T>, IState<T>> {
  constructor(props: IProps<T>) {
    super(props);

    this.state = {
      sortBy: props.defaultSortBy,
      isDesc: isNil(props.defaultSortIsDesc) ? true : props.defaultSortIsDesc,
    };
  }

  public render(): React.ReactNode {
    let list = (this.props.data || []).slice();

    if (this.state.sortBy || this.props.defaultSortBy) {
      list = sortBy(
        pipe(
          prop(this.state.sortBy as string),
          toOrd
        ),
        list
      );

      if (this.state.isDesc) {
        list.reverse();
      }
    }

    const Row = this.rowRender;

    const tableClassName = cn(/* this.props.tableProps.className ,*/ styles.baseTableContainer);

    return (
      <Table {...this.props.tableProps} className={tableClassName}>
        <TableHeader {...result(this.props.headProps || {})}>
          <TableRow>
            {this.props.columns.map((column, i) => (
              <td
                {...column.collProps}
                style={{ width: column.width }}
                onClick={() => this.onClickHead(column)}
                className={cn(
                  this.getHeadClassHash(column),
                  path(['collProps', 'className'], column)
                )}
                key={`${column.property}-${i}`}
                align={'center'}
              >
                <Box direction="row" justify="start" align="center" style={{ cursor: 'pointer' }}>
                  {getContent(column.header)}
                  {getIcon(column, this.state)}
                </Box>
              </td>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody {...result(this.props.bodyProps || {})}>
          {list.map((row: any, rowIndex) => (
            <Row key={rowIndex} row={row} rowIndex={rowIndex} />
          ))}
        </TableBody>
      </Table>
    );
  }

  private generateRowProps = (data: any, nestingLevel: number) => {
    const rowProps = result(this.props.rowProps || {}, data);
    const rowClickable = rowProps.clickable || rowProps.clickable === undefined;

    return {
      ...rowProps,
      className: cn(
        rowProps.className,
        rowClickable ? styles.clickable : '',
        rowProps.actionAllowed ? styles.actionAllowed : '',
        nestingLevel ? styles[`nestingLevel-${nestingLevel}`] : ''
      ),
    };
  };

  private rowRender = (props: any) => {
    const { row, rowIndex, nestingLevel = 0 } = props;
    const rowProps = this.generateRowProps(row, nestingLevel);

    const Row = this.rowRender;

    return (
      <>
        {row.links && !nestingLevel ? <tr className={styles.rowSpacer} /> : null}
        <TableRow {...rowProps}>
          {this.props.columns.map((col, colIndex) => (
            <TableCell
              id={`tablecell_${col.property}_${rowIndex}`}
              {...col.collProps}
              key={`${col.property}-${colIndex}`}
              className={cn(
                this.getColumnClassHash(col),
                path(['collProps', 'className'], col),
                styles.cellStyle
              )}
            >
              {toReactNode(result(col.render || row[col.property], row))}
            </TableCell>
          ))}
        </TableRow>
        {row.links &&
          row.links.map((r: any) => <Row key={r.id} row={r} nestingLevel={nestingLevel + 1} />)}
        {row.links && !nestingLevel ? <tr className={styles.rowSpacer} /> : null}
      </>
    );
  };

  private onClickHead = (item: FlexiTable.IFlexiTableColumn<T>): void => {
    if (!item.sortable) {
      return void 0;
    }
    if (this.state.sortBy !== item.property) {
      this.setState({
        sortBy: item.property,
        isDesc: isNil(this.props.defaultSortIsDesc) ? true : this.props.defaultSortIsDesc,
      });
    } else {
      this.setState({ isDesc: !this.state.isDesc });
    }
  };

  private getHeadClassHash(item: FlexiTable.IFlexiTableColumn<T>): Record<string, boolean> {
    const sorted = this.state.sortBy === item.property;
    return {
      ...this.getColumnClassHash(item),
      [styles.header]: true,
      [styles.sorted]: sorted,
      [styles.clickable]: item.sortable,
    };
  }

  private getColumnClassHash(item: FlexiTable.IFlexiTableColumn<T>): Record<string, boolean> {
    return {
      [styles.alignCenter]: item.align === 'center',
      [styles.alignStart]: item.align === 'start',
      [styles.alignEnd]: item.align === 'end',
    };
  }
}

function result<T extends TNotFunction<any>>(some: (() => T) | T): T;
function result<T extends TNotFunction<any>, R>(some: ((item: R) => T) | T, arg: R): T;
function result<T extends TNotFunction<any>, R>(some: ((a?: R) => T) | T, arg?: R): T {
  if (typeof some === 'function') {
    return (some as ((a?: R) => T))(arg);
  } else {
    return some;
  }
}

function getIcon<T>(props: FlexiTable.IFlexiTableColumn<T>, state: IState<T>) {
  if (props.property === state.sortBy && props.sortable) {
    return state.isDesc ? (
      <Box className={styles.icon}>
        <DownIcon size={'small'} />
      </Box>
    ) : (
      <Box className={styles.icon}>
        <UpIcon size={'small'} />
      </Box>
    );
  }

  return null;
}

function toReactNode(some: string | number | React.ReactNode): React.ReactNode {
  switch (typeof some) {
    case 'string':
    case 'number':
    case 'boolean':
      return <Text>{some}</Text>;
    default:
      if (some instanceof Date) {
        return toReactNode(some.toString());
      }
      if (Array.isArray(some)) {
        return some.map(toReactNode);
      }
      if (isReactElement(some)) {
        return some;
      }
      if (some == null) {
        return null;
      }
      throw new Error(`Wrong content type! ${some}`);
  }
}

function isReactElement(some: any): some is React.ReactNode {
  return some && some.$$typeof && some.$$typeof.toString() === 'Symbol(react.element)';
}

export namespace FlexiTable {
  export interface IFlexiTableColumn<T> {
    property: keyof T | keyof T & 'removeBtn';
    header: string | number | React.ReactNode | React.FunctionComponent<void>;
    sortable?: TSortFunction<T> | boolean;
    align?: TColumnAlign;
    search?: TSearchFunction<T> | boolean; // TODO!
    render?: TRenderFunction<T> | ((item: T) => string | number | boolean);
    collProps?: TableCellProps & { className: string };
    width?: number | string;
  }
}

interface IProps<T> {
  columns: Array<FlexiTable.IFlexiTableColumn<T>>;
  data: Array<T>;
  idKey?: keyof T;
  defaultSortBy?: keyof T | null;
  defaultSortIsDesc?: boolean;
  showLinks?: boolean;
  rowProps?:
    | ((
        data: T
      ) => TableRowProps & { className?: string; clickable?: boolean; actionAllowed?: boolean })
    | TableRowProps & { className?: string; clickable?: boolean };
  bodyProps?:
    | (() => TableBodyProps & { className?: string })
    | TableBodyProps & { className?: string };
  headProps?:
    | (() => TableHeaderProps & { className?: string })
    | TableHeaderProps & { className?: string };
  tableProps?: TableProps & { className?: string };
}

interface IState<T> {
  sortBy?: keyof T | undefined | null | 'removeBtn';
  isDesc?: boolean;
}

type TSortFunction<T> = (data: T) => Ord;
type TColumnAlign = 'center' | 'end' | 'start';
type TSearchFunction<T> = (data: T) => boolean;
type TRenderFunction<T> = (data: T) => React.ReactNode;
type TNotFunction<T> = T extends (...args: Array<any>) => any ? never : T;
