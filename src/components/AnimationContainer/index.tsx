const withFadeAnimation = (WrappedComponent: () => JSX.Element) => {
  return function WithFadeAnimation(props: any) {
    return (
      <div className={'fade-in-out'}>
        <WrappedComponent {...props} />
      </div>
    );
  };
};

export default withFadeAnimation;
