export const mockNavItems = [
  {
    title: 'Item 1',
    iconStyleClass: 'fa-home',
    // TODO badges?
    children: [
      {
        title: 'Item 1-A',
        iconStyleClass: 'fa-envelope',
        children: [
          {
            title: 'Item 1-A-i',
            iconStyleClass: 'fa-envelope-open'
          },
          {
            title: 'Item 1-A-ii',
            iconStyleClass: 'fa-envelope-closed'
          },
          {
            title: 'Item 1-A-iii'
          }
        ]
      },
      {
        title: 'Item 1-B',
        iconStyleClass: 'fa-bell',
        children: [
          {
            title: 'Item 1-B-i'
          },
          {
            title: 'Item 1-B-ii'
          },
          {
            title: 'Item 1-B-iii'
          }
        ]
      },
      {
        title: 'Item 1-C'
      }
    ]
  },
  {
    title: 'Item 2',
    iconStyleClass: 'fa-calendar'
  },
  {
    title: 'Item 3',
    children: [
      {
        title: 'Item 3-A'
      },
      {
        title: 'Item 3-B'
      },
      {
        title: 'Item 3-C',

        children: [
          {
            title: 'Item 3-C-i'
          },
          {
            title: 'Item 3-C-ii'
          },
          {
            title: 'Item 3-C-iii'
          }
        ]
      }
    ]
  },
  {
    title: 'Another item'
  }
];
