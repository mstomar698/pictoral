const CIRCLE_DATA =
  'data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiIHZlcnNpb249IjEuMSI+PGNpcmNsZSBjeD0iOSIgY3k9IjkiIHI9IjUiIHN0cm9rZT0iI2ZmZiIgZmlsbD0iIzAwN2RmYyIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+';

export const CIRCLE_RADIUS = 9;

export const HANDLER_COMMON_PROPS = {
  xmlnsXlink: 'http://www.w3.org/1999/xlink',
  xlinkHref: CIRCLE_DATA,
  preserveAspectRatio: 'none' as const,
  width: CIRCLE_RADIUS * 2,
  height: CIRCLE_RADIUS * 2,
};

export const DEF_HANDLER_RECT_WIDTH = 200;
export const DEF_HANDLER_RECT_HEIGHT = 200;
export const MIN_HANDLER_RECT_WIDTH = 27;
export const MIN_HANDLER_RECT_HEIGHT = 27;
