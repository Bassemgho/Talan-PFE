/* eslint-disable */
import { Box, List, Divider, styled } from '@mui/material';
import { useLocation, matchPath } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Fragment,useContext } from 'react';
import {PollDialogueContext} from 'src/contexts/PollDialogueContext.js'

import SidebarMenuItem from './item';
import menuItems from './items';

const DividerWrapper = styled(Divider)(
  ({ theme }) => `
  background: ${theme.sidebar.menuItemIconColor};
  margin-left: ${theme.spacing(3)};
  margin-right: ${theme.spacing(3)};
  opacity: .25;
`
);

const MenuWrapper = styled(Box)(
  ({ theme }) => `

  &:last-of-type + .MuiDivider-root {
      height: 0;
  }

  .MuiList-root {
    padding: ${theme.spacing(1, 0)};

    .MuiDivider-root {
      background: ${theme.sidebar.menuItemIconColor};
      margin-left: ${theme.spacing(3)};
      margin-right: ${theme.spacing(3)};
    }

    & > .MuiList-root {
      padding: 0;
    }
  }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {
      padding: 0;

      .MuiList-root .MuiList-root .MuiListItem-root .MuiIconButton-root {
        font-weight: normal !important;
      }

      .MuiListItem-root {
        padding: 1px 0;
        justify-content: center;

        .MuiIconButton-root {
          display: flex;
          color: ${theme.sidebar.menuItemColor};
          background-color: ${theme.sidebar.menuItemBg};
          width: ${theme.spacing(6)};
          height: ${theme.spacing(6)};
          transition: ${theme.transitions.create(['all'])};
          justify-content: center;
          font-size: ${theme.typography.pxToRem(13)};
          padding: 0;
          position: relative;

          .name-wrapper {
            display: none;
          }

          .MuiBadge-root {
            position: absolute;
            right: 10px;
            top: 11px;

            .MuiBadge-standard {
              background: ${theme.colors.primary.main};
              font-size: ${theme.typography.pxToRem(10)};
              font-weight: bold;
              text-transform: uppercase;
              color: ${theme.palette.primary.contrastText};
            }
          }

          .MuiSvgIcon-root {
            transition: ${theme.transitions.create(['color'])};
            font-size: ${theme.typography.pxToRem(28)};
            color: ${theme.sidebar.menuItemIconColor};
          }

          &.Mui-active,
          &:hover {
            background-color: ${theme.sidebar.menuItemBgActive};
            color: ${theme.sidebar.menuItemColorActive};

            .MuiSvgIcon-root {
                color: ${theme.sidebar.menuItemIconColorActive};
            }
          }
        }
      }
    }
`
);

const renderSidebarMenuItems = ({ items, path },onOpen,openAll) => (
  <SubMenuWrapper>
    <List component="div">
      {items.reduce((ev, item) => reduceChildRoutes({ ev, item, path },onOpen,openAll), [])}
    </List>
  </SubMenuWrapper>
);
const handleClick = (name,onOpen,openAll) => {
  switch (name) {
    case 'Add Polls':
      onOpen();
      break;
    case 'View Polls':
      openAll()
      break;

  }

}
const reduceChildRoutes = ({ ev, path, item },onOpen,openAll) => {
  const key = uuidv4();

  const exactMatch = item.link
    ? !!matchPath(
        {
          path: item.link,
          end: true
        },
        path
      )
    : false;

  if (item.items) {
    const partialMatch = item.link
      ? !!matchPath(
          {
            path: item.link,
            end: false
          },
          path
        )
      : false;

    ev.push(
      <SidebarMenuItem
        key={key}
        active={partialMatch}
        open={partialMatch}
        name={item.name}
        icon={item.icon}
        link={item.link}
        badge={item.badge}
      >
        {renderSidebarMenuItems({
          path,
          items: item.items
        },onOpen,openAll)}
      </SidebarMenuItem>
    );
  } else {
    ev.push(
      <SidebarMenuItem
        key={key}
        active={exactMatch}
        name={item.name}
        link={item.link}
        badge={item.badge}
        icon={item.icon}
        onClick={() => {
          handleClick(item.name,onOpen,openAll)
        }}
      />
    );
  }

  return ev;
};

function SidebarMenu() {
  const {isOpen,onOpen,onClose,openAll} = useContext(PollDialogueContext)
  const location = useLocation();

  return (
    <>
      {menuItems.map((section) => (
        <Fragment key={uuidv4()}>
          <MenuWrapper>
            <List  path={location.pathname} component="div">
              {renderSidebarMenuItems({
                items: section.items,
                path: location.pathname
              },onOpen,openAll)}
            </List>
          </MenuWrapper>
          <DividerWrapper />
        </Fragment>
      ))}
    </>
  );
}

export default SidebarMenu;
