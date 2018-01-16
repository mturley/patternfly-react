export const mockNavItems = [
  {
    title: 'Dashboard',
    initialActive: true,
    iconClass: 'fa fa-dashboard',
    // TODO badges?
    subItems: [
      {
        title: 'Item 1-A',
        iconClass: 'fa fa-envelope',
        subItems: [
          {
            title: 'Item 1-A-i',
            iconClass: 'fa fa-envelope-open'
          },
          {
            title: 'Item 1-A-ii',
            iconClass: 'fa fa-envelope-closed'
          },
          {
            title: 'Item 1-A-iii'
          }
        ]
      },
      {
        title: 'Item 1-B',
        iconClass: 'fa fa-bell',
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
    iconClass: 'fa fa-shield'
  },
  {
    title: 'Ipsum',
    iconClass: 'fa fa-space-shuttle',
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
    iconClass: 'fa fa-paper-plane'
  },
  {
    title: 'Adipscing',
    iconClass: 'fa fa-graduation-cap'
  },
  {
    title: 'Lorem',
    iconClass: 'fa fa-gamepad'
  }
];
