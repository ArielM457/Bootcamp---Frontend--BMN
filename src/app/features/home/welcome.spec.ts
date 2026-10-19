import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Welcome } from './welcome';

describe('Welcome HOME-01', () => {
  it('muestra el menú principal sin etiquetas de desarrollo', async () => {
    await TestBed.configureTestingModule({
      imports: [Welcome],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(Welcome);
    await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    const menu = root.querySelector('nav[aria-label="Menú de Bomberman Online"]');
    const links = menu?.querySelectorAll('a');

    expect(menu).toBeTruthy();
    expect(links).toHaveLength(4);
    expect(root.textContent).not.toContain('Base en desarrollo · Fase 0');
    expect(root.textContent).not.toContain('Simulación visual');
    expect(root.textContent).not.toContain('CodeSprint');
    expect(root.textContent).not.toContain('Escena animada de presentación');
    expect(root.textContent).toContain('Buscar sala');
    expect(root.querySelector('header')).toBeNull();
  });
});
