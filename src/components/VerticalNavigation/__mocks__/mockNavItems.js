import cx from 'classnames';
import React from 'react';

import { Button, ListViewInfoItem } from '../../../index';

// TODO make this make more sense for VerticalNavigation

export const mockNavItems = [
  {
    title: 'Item 1',
    description: 'This is Item 1 description',
    properties: { hosts: 3, clusters: 1, nodes: 7, images: 4 },
    expandedContentText:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    children: [
      {
        title: 'Item 1-A',
        description: 'This is Item 1-A description',
        properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
        expandedContentText:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
        children: [
          {
            title: 'Item 1-A-i',
            description: 'This is Item 1-A-i description',
            properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
            expandedContentText:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
          },
          {
            title: 'Item 1-A-ii',
            description: 'This is Item 1-A-ii description',
            properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
            expandedContentText:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
          },
          {
            title: 'Item 1-A-iii',
            description: 'This is Item 1-A-iii description',
            properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
            expandedContentText:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
          },
        ],
      },
      {
        title: 'Item 1-B',
        description: 'This is Item 1-B description',
        properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
        expandedContentText:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
        children: [
          {
            title: 'Item 1-B-i',
            description: 'This is Item 1-B-i description',
            properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
            expandedContentText:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
          },
          {
            title: 'Item 1-B-ii',
            description: 'This is Item 1-B-ii description',
            properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
            expandedContentText:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
          },
          {
            title: 'Item 1-B-iii',
            description: 'This is Item 1-B-iii description',
            properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
            expandedContentText:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
          },
        ],
      },
      {
        title: 'Item 1-C',
        description: 'This is Item 1-C description',
        properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
        expandedContentText:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
      },
    ],
  },
  {
    title: 'Item 2',
    description: 'This is Item 2 description',
    properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
    expandedContentText:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
  },
  {
    title: 'Item 3',
    description: 'This is Item 3 description',
    properties: { hosts: 4, clusters: 2, nodes: 9, images: 8 },
    expandedContentText:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
    children: [
      {
        title: 'Item 3-A',
        description: 'This is Item 3-A description',
        properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
        expandedContentText:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
      },
      {
        title: 'Item 3-B',
        description: 'This is Item 3-B description',
        properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
        expandedContentText:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
      },
      {
        title: 'Item 3-C',
        description: 'This is Item 3-C description',
        properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
        expandedContentText:
          'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
        children: [
          {
            title: 'Item 3-C-i',
            description: 'This is Item 3-C-i description',
            properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
            expandedContentText:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
          },
          {
            title: 'Item 3-C-ii',
            description: 'This is Item 3-C-ii description',
            properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
            expandedContentText:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
          },
          {
            title: 'Item 3-C-iii',
            description: 'This is Item 3-C-iii description',
            properties: { hosts: 2, clusters: 1, nodes: 11, images: 8 },
            expandedContentText:
              'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
          },
        ],
      },
    ],
  },
  {
    description: 'This is Item without heading',
    expandedContentText:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
  },
  {
    properties: { hosts: 4, clusters: 2, nodes: 9, images: 8 },
    expandedContentText:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
  },
  {
    title: 'Item without description',
    expandedContentText:
      'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
  },
];

export const renderActions = () => (
  <div>
    <Button>Details</Button>
  </div>
);

export const renderAdditionalInfoItems = itemProperties => {
  return (
    itemProperties &&
    Object.keys(itemProperties).map(prop => {
      const classNames = cx('pficon', {
        'pficon-flavor': prop === 'hosts',
        'pficon-cluster': prop === 'clusters',
        'pficon-container-node': prop === 'nodes',
        'pficon-image': prop === 'images',
      });
      return (
        <ListViewInfoItem key={prop}>
          <span className={classNames} />
          <strong>{itemProperties[prop]}</strong> {prop}
        </ListViewInfoItem>
      );
    })
  );
};
