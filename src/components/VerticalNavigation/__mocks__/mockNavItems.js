export const mockNavItems = [
  {
    title: 'Dashboard',
    initialActive: true,
    iconStyleClass: 'fa fa-dashboard',
    // TODO badges?
    subItems: [
      {
        title: 'Item 1-A',
        iconStyleClass: 'fa fa-envelope',
        subItems: [
          {
            title: 'Item 1-A-i',
            iconStyleClass: 'fa fa-envelope-open'
          },
          {
            title: 'Item 1-A-ii',
            iconStyleClass: 'fa fa-envelope-closed'
          },
          {
            title: 'Item 1-A-iii'
          }
        ]
      },
      {
        title: 'Item 1-B',
        iconStyleClass: 'fa fa-bell',
        subItems: [
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
    title: 'Dolor',
    iconStyleClass: 'fa fa-shield'
  },
  {
    title: 'Ipsum',
    iconStyleClass: 'fa fa-space-shuttle',
    subItems: [
      {
        title: 'Item 3-A'
      },
      {
        title: 'Item 3-B'
      },
      {
        title: 'Item 3-C',
        subItems: [
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
    title: 'Amet',
    iconStyleClass: 'fa fa-paper-plane'
  },
  {
    title: 'Adipscing',
    iconStyleClass: 'fa fa-graduation-cap'
  },
  {
    title: 'Lorem',
    iconStyleClass: 'fa fa-gamepad'
  }
];
