import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  it('deja la navegación en manos de cada pantalla', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('nav')).toBeNull();
    expect(root.querySelector('header')).toBeNull();
    expect(root.querySelector('router-outlet')).toBeTruthy();
    expect(root.querySelector<HTMLAnchorElement>('.skip-link')?.getAttribute('href')).toBe(
      '#route-content',
    );
    expect(root.querySelector('#route-content')?.getAttribute('tabindex')).toBe('-1');
  });
});
